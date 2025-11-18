import { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, DollarSign, Users, Phone, CheckCircle, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrency } from "@/hooks/useROICalculation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface QualificationFormData {
  companyName: string;
  location: string;
  services: string;
  contactName: string;
  phone: string;
  email: string;
  employeeCount: string;
  inboundCallsPerDay: number;
  missedCallsPerDay: number;
  avgProjectValue: number;
  newClientsPerMonth: number;
  customerAcquisitionCost: number;
  lifetimeValue: number;
  currentCallMethod: string;
  painPoints: string;
}

const Qualification = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<QualificationFormData>({
    defaultValues: {
      companyName: "",
      location: "",
      services: "",
      contactName: "",
      phone: "",
      email: "",
      employeeCount: "",
      inboundCallsPerDay: 0,
      missedCallsPerDay: 0,
      avgProjectValue: 0,
      newClientsPerMonth: 0,
      customerAcquisitionCost: 0,
      lifetimeValue: 0,
      currentCallMethod: "",
      painPoints: "",
    },
  });

  const watchedValues = form.watch();
  
  // ROI Calculations
  const callbackRate = 0.15; // 85% don't call back
  const conversionRate = 0.30; // 30% of answered calls convert
  const workingDaysPerMonth = 21;
  const workingDaysPerYear = 250;
  
  const dailyLostRevenue = watchedValues.missedCallsPerDay * watchedValues.avgProjectValue * (1 - callbackRate) * conversionRate;
  const monthlyLostRevenue = dailyLostRevenue * workingDaysPerMonth;
  const annualLostRevenue = dailyLostRevenue * workingDaysPerYear;
  
  const monthlyServiceCost = 1000;
  const annualServiceCost = 6000; // With 50% discount
  const setupFee = 450;
  
  const potentialRecoveryRate = 0.60; // AI agent can recover 60% of missed calls
  const monthlyRecoveredRevenue = monthlyLostRevenue * potentialRecoveryRate;
  const annualRecoveredRevenue = annualLostRevenue * potentialRecoveryRate;
  
  const monthlyNetGain = monthlyRecoveredRevenue - monthlyServiceCost;
  const annualNetGain = annualRecoveredRevenue - annualServiceCost - setupFee;
  const roiPercentage = annualServiceCost > 0 ? ((annualRecoveredRevenue - annualServiceCost) / annualServiceCost * 100) : 0;
  
  const oneClientPerMonth = watchedValues.avgProjectValue * 12;
  const breakEvenClients = Math.ceil((annualServiceCost + setupFee) / watchedValues.avgProjectValue);

  const isQualified = watchedValues.missedCallsPerDay >= 3 && watchedValues.avgProjectValue >= 500;
  const isHighValue = watchedValues.avgProjectValue >= 2000 && watchedValues.missedCallsPerDay >= 5;

  const handleSaveSubmission = async () => {
    const values = form.getValues();
    
    // Validation - require at least company name and key metrics
    if (!values.companyName) {
      toast({
        title: "Missing Information",
        description: "Please enter at least the company name before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('qualification_submissions')
        .insert({
          company_name: values.companyName,
          location: values.location,
          services: values.services,
          contact_name: values.contactName,
          phone: values.phone,
          email: values.email,
          employee_count: values.employeeCount,
          inbound_calls_per_day: values.inboundCallsPerDay,
          missed_calls_per_day: values.missedCallsPerDay,
          current_call_method: values.currentCallMethod,
          pain_points: values.painPoints,
          avg_project_value: values.avgProjectValue,
          new_clients_per_month: values.newClientsPerMonth,
          customer_acquisition_cost: values.customerAcquisitionCost,
          lifetime_value: values.lifetimeValue,
          // Store calculated ROI metrics
          daily_lost_revenue: dailyLostRevenue,
          monthly_lost_revenue: monthlyLostRevenue,
          annual_lost_revenue: annualLostRevenue,
          monthly_recovered_revenue: monthlyRecoveredRevenue,
          annual_recovered_revenue: annualRecoveredRevenue,
          monthly_net_gain: monthlyNetGain,
          annual_net_gain: annualNetGain,
          roi_percentage: roiPercentage,
          is_qualified: isQualified,
          is_high_value: isHighValue,
        });

      if (error) throw error;

      toast({
        title: "Qualification Saved",
        description: `Saved submission for ${values.companyName}. You can continue editing or start a new qualification.`,
      });

      // Optionally reset form after save
      // form.reset();
      
    } catch (error) {
      console.error('Error saving qualification:', error);
      toast({
        title: "Save Failed",
        description: "Could not save the qualification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sales Qualification Tool - AiAgents3000</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8 mt-20">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3">Sales Qualification & ROI Calculator</h1>
            <p className="text-muted-foreground text-lg">Internal tool for positioning and qualifying prospects</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <Badge variant={isHighValue ? "default" : isQualified ? "secondary" : "outline"}>
                {isHighValue ? "🔥 High-Value Prospect" : isQualified ? "✓ Qualified Lead" : "⏳ Gathering Info"}
              </Badge>
              <Button
                onClick={handleSaveSubmission}
                disabled={isSaving || !watchedValues.companyName}
                size="sm"
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Qualification"}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              <Form {...form}>
                <form className="space-y-6">
                  {/* Business Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Business Details
                      </CardTitle>
                      <CardDescription>Basic information about the prospect's company</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="ABC Services Inc" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="New York, NY" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="services"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Main Services Offered</FormLabel>
                            <FormControl>
                              <Input placeholder="HVAC, Plumbing, Electrical" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Person</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@company.com" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="employeeCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Employees/Staff</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-5">1-5 employees</SelectItem>
                                <SelectItem value="6-10">6-10 employees</SelectItem>
                                <SelectItem value="11-25">11-25 employees</SelectItem>
                                <SelectItem value="26-50">26-50 employees</SelectItem>
                                <SelectItem value="51+">51+ employees</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Lead Qualification & Pain Points */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Lead Qualification & Pain Points
                      </CardTitle>
                      <CardDescription>Critical questions to identify pain and opportunity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="inboundCallsPerDay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inbound Calls Per Day</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="20" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>Ask: "How many calls do you get on a typical day?"</FormDescription>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="missedCallsPerDay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-destructive">Missed Calls Per Day *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="5" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="border-destructive"
                                />
                              </FormControl>
                              <FormDescription>Key question! "How often do calls go unanswered?"</FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="currentCallMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Call Handling Method (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="e.g., Front desk staff, answering service, voicemail only..." 
                                {...field}
                                rows={2}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="painPoints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Pain Points (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What happens when they miss calls? Do they lose business? Staff overwhelmed?" 
                                {...field}
                                rows={3}
                              />
                            </FormControl>
                            <FormDescription>
                              Ask: "What happens when you miss a call? Do customers call back or go to competitors?"
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Financial Impact */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Financial Impact
                      </CardTitle>
                      <CardDescription>Numbers that drive ROI calculations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="avgProjectValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-primary">Average Project Value *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="2500" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="border-primary"
                                />
                              </FormControl>
                              <FormDescription>Critical! "What's a typical customer worth?"</FormDescription>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newClientsPerMonth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Clients Per Month</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="10" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="customerAcquisitionCost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer Acquisition Cost (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="500" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>Marketing + time to get a customer</FormDescription>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lifetimeValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lifetime Value Per Customer (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="5000" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>Total value over customer relationship</FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </div>

            {/* ROI Display Column */}
            <div className="space-y-6">
              {/* Qualification Status */}
              {watchedValues.missedCallsPerDay > 0 && watchedValues.avgProjectValue > 0 && (
                <Card className={isQualified ? "border-primary shadow-lg" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">Qualification Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isHighValue ? (
                      <Alert className="bg-primary/10 border-primary">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <AlertDescription>
                          <strong>High-Value Prospect!</strong> Perfect fit. High call volume + high ticket value = massive ROI.
                        </AlertDescription>
                      </Alert>
                    ) : isQualified ? (
                      <Alert className="bg-secondary">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Qualified Lead.</strong> Good opportunity. Focus on capturing missed revenue.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Need more info. Target: 3+ missed calls/day + $500+ project value.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Lost Revenue */}
              {dailyLostRevenue > 0 && (
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive">💸 Lost Revenue</CardTitle>
                    <CardDescription>Money leaving the table</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Daily Loss</div>
                      <div className="text-2xl font-bold text-destructive">{formatCurrency(dailyLostRevenue)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Monthly Loss</div>
                      <div className="text-3xl font-bold text-destructive">{formatCurrency(monthlyLostRevenue)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Annual Loss</div>
                      <div className="text-4xl font-bold text-destructive">{formatCurrency(annualLostRevenue)}</div>
                    </div>
                    <Alert className="bg-destructive/10">
                      <AlertDescription className="text-sm">
                        <strong>Sales Tip:</strong> "You're losing {formatCurrency(monthlyLostRevenue)}/month to unanswered calls. That's {formatCurrency(annualLostRevenue)}/year walking out the door."
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {/* ROI Impact */}
              {monthlyRecoveredRevenue > 0 && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                      <TrendingUp className="w-5 h-5" />
                      ROI With AI Agent
                    </CardTitle>
                    <CardDescription>Recovered revenue & net gain</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Monthly Recovered Revenue</div>
                      <div className="text-2xl font-bold text-primary">{formatCurrency(monthlyRecoveredRevenue)}</div>
                      <div className="text-xs text-muted-foreground">Captures 60% of missed calls</div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="text-sm text-muted-foreground">Monthly Net Gain</div>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(monthlyNetGain)}</div>
                      <div className="text-xs text-muted-foreground">After ${monthlyServiceCost}/mo service cost</div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-sm text-muted-foreground">Annual Net Gain</div>
                      <div className="text-3xl font-bold text-green-600">{formatCurrency(annualNetGain)}</div>
                      <div className="text-xs text-muted-foreground">First year (includes setup)</div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-sm text-muted-foreground">ROI</div>
                      <div className="text-2xl font-bold">{roiPercentage.toFixed(0)}%</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sales Positioning */}
              {watchedValues.avgProjectValue > 0 && (
                <Card className="bg-secondary">
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Sales Positioning</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <strong>One-Client Close:</strong>
                      <p className="text-muted-foreground">
                        "Just ONE extra customer per month = {formatCurrency(oneClientPerMonth)}/year. 
                        The AI pays for itself with {breakEvenClients} {breakEvenClients === 1 ? 'customer' : 'customers'}."
                      </p>
                    </div>
                    
                    {monthlyNetGain > 0 && (
                      <div>
                        <strong>Risk-Free Investment:</strong>
                        <p className="text-muted-foreground">
                          "You're already losing {formatCurrency(monthlyLostRevenue)}/mo. Our AI recovers {formatCurrency(monthlyRecoveredRevenue)}/mo, 
                          netting you {formatCurrency(monthlyNetGain)}/mo in pure profit."
                        </p>
                      </div>
                    )}

                    <div>
                      <strong>Cost Comparison:</strong>
                      <p className="text-muted-foreground">
                        "At ${monthlyServiceCost}/mo, the AI costs less than a part-time receptionist, 
                        but works 24/7 and never misses a call."
                      </p>
                    </div>

                    {isHighValue && (
                      <Alert className="bg-primary/10 border-primary">
                        <AlertDescription>
                          <strong>Perfect Fit!</strong> Emphasize: high call volume + high ticket = massive missed opportunity. 
                          AI captures it all automatically.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">✅ Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-primary" />
                    <span>Share ROI numbers above</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-primary" />
                    <span>Demo the AI agent capabilities</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-primary" />
                    <span>Address integration & setup</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-primary" />
                    <span>Send proposal with annual plan (50% off)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Qualification;
