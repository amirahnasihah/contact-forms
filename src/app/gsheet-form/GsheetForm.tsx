"use client";
import React, { useEffect, useState } from "react";
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
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Card } from "@/components/ui/card";

// ZOD Validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  position: z.string().min(2, { message: "Must be at least 2 characters." }),
  message: z.string().optional(),
});

export default function GsheetForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");
  const [document, setDocument] = useState<File[]>([]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setDocument(acceptedFiles);
    }
  }, [acceptedFiles]);

  // Define your form with zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "",
      message: "",
    },
  });

  async function onSubmit(values: any) {
    if (!executeRecaptcha) {
      setNotification("Recaptcha not ready, refresh page.");
      return;
    }

    setSubmitting(true);

    try {
      const gReCaptchaToken = await executeRecaptcha("enquiryFormSubmit");

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("position", values.position);
      formData.append("message", values.message || "");
      formData.append("gRecaptchaToken", gReCaptchaToken);

      if (document.length > 0) {
        formData.append("document", document[0], document[0].name);
      }

      const response = await fetch("/api/gsheet", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({ title: "✅ Email submitted successfully!" });
        form.reset();
        router.push("/join-us");
      } else {
        toast({ variant: "destructive", title: "Submission failed." });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error occurred during submission.",
      });
    }

    setSubmitting(false);
  }

  return (
    <Card className="border-none bg-transparent shadow-none p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Muhammad Bin Abdullah" />
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
                  <Input {...field} placeholder="youremail@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Apply</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="E.g. Digital Marketer" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="document"
            render={() => (
              <FormItem>
                <FormLabel>Upload Resume</FormLabel>
                <FormControl>
                  <div
                    {...getRootProps()}
                    className="bg-white hover:cursor-pointer text-black py-2 rounded-md text-center hover:bg-gray-200"
                  >
                    <input {...getInputProps()} />
                    <p>
                      {document.length > 0
                        ? `${document.length} file selected`
                        : "Choose file here"}
                    </p>
                    {acceptedFiles.map((file) => (
                      <p key={file.name}>{file.name}</p>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="What interests you about?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="pt-2">
            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Card>
  );
}
