import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RetellChatInterface } from "@/components/RetellChatInterface";

const MedicalOffice = () => {
    return (
        <>
            <Helmet>
                <title>Alpine Family Medicine AI Demo - Medical Office AI Receptionist | AI Agents 3000</title>
                <meta
                    name="description"
                    content="Try our AI receptionist demo for Alpine Family Medicine. Experience how AI handles appointment scheduling, insurance questions, and patient inquiries."
                />
                <meta name="keywords" content="medical office AI demo, AI receptionist demo, healthcare AI, voice AI medical" />
                <link rel="canonical" href="https://aiagents3000.com/demos/medical-office" />

                <meta property="og:title" content="Alpine Family Medicine AI Demo | AI Agents 3000" />
                <meta property="og:description" content="Experience an AI receptionist for a medical office. Try our interactive demo." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://aiagents3000.com/demos/medical-office" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Alpine Family Medicine AI Demo" />
                <meta name="twitter:description" content="Try our medical office AI receptionist demo." />
            </Helmet>

            <div className="min-h-screen flex flex-col bg-background">
                <Navigation />

                <main className="flex-grow">
                    {/* Header */}
                    <section className="py-8 px-4 border-b">
                        <div className="max-w-6xl mx-auto">
                            <Button variant="ghost" asChild className="mb-4">
                                <Link to="/ai-agent-demos">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Demos
                                </Link>
                            </Button>
                            <h1 className="text-4xl font-bold mb-2">Alpine Family Medicine</h1>
                            <p className="text-lg text-muted-foreground">
                                Medical Office AI Receptionist Demo
                            </p>
                        </div>
                    </section>

                    {/* Demo Section */}
                    <section className="py-12 px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Instructions */}
                                <div className="lg:col-span-1">
                                    <div className="bg-card border rounded-lg p-6 sticky top-24">
                                        <h2 className="text-xl font-semibold mb-4">How to Use This Demo</h2>
                                        <ol className="space-y-3 text-sm text-muted-foreground">
                                            <li className="flex gap-2">
                                                <span className="font-semibold text-primary">1.</span>
                                                <span>Click "Start Chat" to begin the conversation</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="font-semibold text-primary">2.</span>
                                                <span>Type your questions about the medical office</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="font-semibold text-primary">3.</span>
                                                <span>Try asking about appointments, insurance, or office hours</span>
                                            </li>
                                        </ol>

                                        <div className="mt-6 pt-6 border-t">
                                            <h3 className="font-semibold mb-2">Sample Questions:</h3>
                                            <ul className="space-y-2 text-sm text-muted-foreground">
                                                <li>• "I need to schedule an annual checkup"</li>
                                                <li>• "What insurance do you accept?"</li>
                                                <li>• "What are your office hours?"</li>
                                                <li>• "Can I get a prescription refill?"</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Widget Container */}
                                <div className="lg:col-span-2">
                                    <RetellChatInterface
                                        agentId="agent_PLACEHOLDER_MEDICAL"
                                        title="Alpine Family Medicine AI"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About This Demo */}
                    <section className="py-12 px-4 bg-muted/50">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6 text-center">About This Demo</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-card border rounded-lg p-6">
                                    <h3 className="font-semibold mb-2">Business Type</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Family medicine practice offering primary care, preventive services, and chronic disease management for patients of all ages.
                                    </p>
                                </div>
                                <div className="bg-card border rounded-lg p-6">
                                    <h3 className="font-semibold mb-2">AI Capabilities</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Handles appointment scheduling, insurance verification questions, office hours, prescription refill requests, and general patient inquiries.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default MedicalOffice;
