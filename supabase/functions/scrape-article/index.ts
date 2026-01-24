import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser, Element, Node } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract main article content from HTML
function extractArticleContent(html: string): { title: string; content: string; author: string | null } {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    if (!doc) {
        return { title: '', content: '', author: null };
    }

    // Extract title
    let title = '';
    const titleSelectors = ['h1', 'article h1', '.article-title', '.post-title', '[itemprop="headline"]', 'title'];
    for (const selector of titleSelectors) {
        const el = doc.querySelector(selector);
        if (el?.textContent?.trim()) {
            title = el.textContent.trim();
            break;
        }
    }

    // Extract author
    let author: string | null = null;
    const authorSelectors = [
        '[rel="author"]',
        '[itemprop="author"]',
        '.author-name',
        '.byline',
        '.post-author',
    ];
    for (const selector of authorSelectors) {
        const el = doc.querySelector(selector);
        if (el?.textContent?.trim()) {
            author = el.textContent.trim();
            break;
        }
    }

    // Extract main content
    let content = '';
    const contentSelectors = [
        'article',
        '[role="main"]',
        '.post-content',
        '.article-content',
        '.entry-content',
        '.content-body',
        'main',
    ];

    for (const selector of contentSelectors) {
        const el = doc.querySelector(selector);
        if (el) {
            // Remove script, style, nav, header, footer, aside elements
            const elementsToRemove = el.querySelectorAll('script, style, nav, header, footer, aside, .ad, .advertisement, .social-share, .comments');
            elementsToRemove.forEach((node) => (node as Element).remove());

            // Get text content with some structure
            content = extractTextContent(el);
            if (content.length > 200) {
                break;
            }
        }
    }

    // Fallback: get body content
    if (!content && doc.body) {
        const elementsToRemove = doc.body.querySelectorAll('script, style, nav, header, footer, aside');
        elementsToRemove.forEach((node) => (node as Element).remove());
        content = extractTextContent(doc.body);
    }

    return { title, content, author };
}

// Extract text content preserving paragraph structure
function extractTextContent(element: Element): string {
    const paragraphs: string[] = [];

    const walkNodes = (node: Node) => {
        if (node.nodeType === 1) { // Element
            const el = node as Element;
            const tagName = el.tagName.toLowerCase();

            if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote'].includes(tagName)) {
                const text = el.textContent?.trim();
                if (text && text.length > 20) {
                    if (tagName.startsWith('h')) {
                        paragraphs.push(`## ${text}`);
                    } else if (tagName === 'li') {
                        paragraphs.push(`- ${text}`);
                    } else {
                        paragraphs.push(text);
                    }
                }
            } else {
                for (const child of Array.from(el.childNodes)) {
                    walkNodes(child);
                }
            }
        }
    };

    walkNodes(element);
    return paragraphs.join('\n\n');
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { url } = await req.json();

        if (!url) {
            return new Response(
                JSON.stringify({ error: 'URL is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        console.log('Scraping article from:', url);

        // Fetch the webpage
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; AIBlogBot/1.0; +https://aiagents3000.com)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        console.log('Fetched HTML, length:', html.length);

        // Extract article content
        const articleData = extractArticleContent(html);

        console.log('Extracted:', {
            title: articleData.title.substring(0, 50),
            contentLength: articleData.content.length,
            author: articleData.author,
        });

        return new Response(
            JSON.stringify({
                success: true,
                title: articleData.title,
                content: articleData.content,
                author: articleData.author,
                url: url,
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error scraping article:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to scrape article'
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
