import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createAdminAccount = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: {
          email: 'dgarcia89@gmail.com',
          password: 'swordfish89',
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Admin account created successfully. You can now login.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>
            Click the button below to create the admin account with preset credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-mono">
                <strong>Email:</strong> dgarcia89@gmail.com<br />
                <strong>Password:</strong> swordfish89
              </p>
            </div>
            <Button 
              onClick={createAdminAccount} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Admin Account...
                </>
              ) : (
                'Create Admin Account'
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              After creation, navigate to /admin/login to sign in
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
