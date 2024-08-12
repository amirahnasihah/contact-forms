"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { basicFormSchema } from "@/zod/schemas/basicForm";
import { useToast } from "@/components/ui/use-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusButton from "@/components/animata/submit-button";

export function BasicForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    clearErrors,
    reset,
  } = useForm<typeof basicFormSchema>();
  const { toast } = useToast();
  const router = useRouter();

  // State for notification

  const [notification, setNotification] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof basicFormSchema>>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      username: "",
    },
  });

  // 1(a). Use google recaptcha validation
  const { executeRecaptcha } = useGoogleReCaptcha();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof basicFormSchema>) {
    // console.log("form data:-", values);
    // Ensure recaptcha is available
    if (!executeRecaptcha) {
      // console.log("Execute recaptcha not available yet");
      setNotification(
        "Execute recaptcha not available yet, likely meaning key not recaptcha key not set"
      );
      return;
    }
    setSubmitting(true);

    try {
      const gReCaptchaToken = await executeRecaptcha("enquiryFormSubmit");

      // Prepare form data
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("favourite", values.favourite);
      formData.append("description", values.description || "");
      formData.append("gRecaptchaToken", gReCaptchaToken);

      // Submit the form data to the server
      const response = await fetch("/api/basic", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        // console.log("responseData", responseData);
        if (responseData.message === "Success save data and send email") {
          setNotification(`Success with score: ${responseData.score}`);
          toast({
            title:
              "✅ Email submitted successfully! Please also check your email in SPAM folder.",
          });
          reset();
          router.push("/");
        } else {
          setNotification(`Failure with score: ${responseData.score}`);
        }
      } else {
        console.error("Failed to submit form:", responseData.error);
        toast({
          variant: "destructive",
          title: "Failed to submit form",
        });
        setNotification("Failure: " + responseData.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        description: "Error: Invalid site key. Refresh page.",
      });
      setNotification("Error submitting form");
    }

    setSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* USERNAME */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Sukuna" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* EMAIL */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="youremail@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NUMBER */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="0123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* MULTIPLE SELECT */}
        <FormField
          control={form.control}
          name="favourite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favourite Colors</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a color to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="indigo">Indigo</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIPTION - textarea */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SUBMIT BUTTON */}
        {/* <StatusButton onSubmit={onSubmit} formValues={form.getValues()} /> */}

        <Button disabled={isSubmitting} type="submit">
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
