import React from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  companyName: z.string().min(1, "Company name is required"),
  gstinCode: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

function SignUp() {
  const { register } = useAuth();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      companyName: "",
      gstinCode: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    try {
      const payload = {
        customer_email_address: data.email,
        password: data.password,
        customer_firstname: data.firstName,
        customer_lastname: data.lastName,
        customer_telephone: data.phone,
        customer_company_name: data.companyName,
        customer_logid: data.email,
        gstin_code: data.gstinCode || "",
        customer_gender: "M",
        customer_secret_qu: "What is your favorite color?",
        customer_secret_answer: "Blue",
        customer_status: 1,
        customer_type: 1,
        customer_country_id: 1,
        customer_zone_id: 1,
        customer_business_entity: "LLP",
        customer_company_type: 1,
        customer_company_address: "123 Business St",
        customer_product_service: 1,
        customer_main_product: "Electronics",
        customer_default_address_id: 0,
        customer_fax: "",
        customer_guide_flag: 0,
        supplier_class: 0,
        buyer_class: 0,
        customer_class: 0,
        customer_date_birth: new Date().toISOString().split('T')[0],
        customer_id_type: 0,
        customer_id_no: "0",
        customer_date_reg: new Date().toISOString().split('T')[0],
        language_id: 1,
        customer_activate_code: "",
        supplier_verify_status: 0,
        supplier_pass_time: new Date().toISOString(),
        website: "",
        is_payed: 0,
        is_free: 0,
        ip_address: "",
        ip_country: ""
      };

      console.log('Submitting registration data:', payload);
      await register(payload);
      toast.success("Account created successfully! Please verify your email.");
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle different error formats
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response?.data?.detail) {
        // If detail is an array, join the messages
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map((err: any) => 
            typeof err === 'string' ? err : err.msg || JSON.stringify(err)
          ).join(', ');
        } else if (typeof error.response.data.detail === 'string') {
          // If detail is a string
          errorMessage = error.response.data.detail;
        }
      }
      
      toast.error(errorMessage);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gstinCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GSTIN Code (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="GSTIN1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        terms and conditions
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default SignUp;
