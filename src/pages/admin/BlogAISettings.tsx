import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, LogOut, BarChart3, Bot } from "lucide-react";
import { AdminAISettings } from "@/components/admin/AdminAISettings";

const BlogAISettings = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        checkAdminAccess();
    }, []);

    const checkAdminAccess = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setIsAdmin(false);
            return;
        }

        const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .eq("role", "admin");

        setIsAdmin(roles && roles.length > 0);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    if (isAdmin === null) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-muted-foreground mb-6">You need admin privileges to access this page.</p>
                    <Link to="/" className="text-primary hover:underline">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/admin/blog"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Blog
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Bot className="w-8 h-8" />
                            AI Content Settings
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button asChild variant="outline">
                            <Link to="/admin/analytics">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Analytics
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* AI Settings Component */}
                <AdminAISettings />
            </div>
        </div>
    );
};

export default BlogAISettings;
