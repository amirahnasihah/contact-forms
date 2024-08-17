"use client";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDropzone } from "react-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";

// name: string;
// email: string;
// number: number;
// company: string;
// position: string;
// linkedin: string;
// message: string;

const formSchema = z.object({
  username: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  position: z.string().min(2, { message: "Must be at least 2 characters." }),
  message: z.string().optional(),
});

export default function PdfForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    clearErrors,
    reset,
  } = useForm<typeof formSchema>();
  const router = useRouter();
  const [notification, setNotification] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ATTACHMENT
  const [document, setDocument] = useState<File[]>([]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const files = acceptedFiles.map((file) => (
    <p key={file.name} className="text-[10px]">
      {file.name}
    </p>
  ));

  useEffect(() => {
    if (acceptedFiles !== undefined) {
      setDocument(acceptedFiles);
    }
  }, [acceptedFiles, setDocument]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      position: "",
    },
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!executeRecaptcha) {
      setNotification(
        "Execute recaptcha not available yet, likely meaning key not set"
      );
      return;
    }

    setSubmitting(true);

    try {
      const gReCaptchaToken = await executeRecaptcha("enquiryFormSubmit");

      const formData = new FormData();
      formData.append("name", values.username);
      formData.append("email", values.email);
      formData.append("position", values.position);
      formData.append("message", values.message || "");
      formData.append("gRecaptchaToken", gReCaptchaToken);

      if (document.length > 0) {
        formData.append("document", document[0], document[0].name);
      }

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setNotification(`Success with score: ${responseData.score}`);
          reset();
          setDocument([]);
        } else {
          setNotification(`${responseData.message || "Unknown error"}`);
        }
      } else {
        setNotification(`Server error: ${response.statusText}`);
      }
    } catch (error) {
      setNotification("Error submitting form");
    }

    setSubmitting(false);
  }
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle>Apply here</CardTitle>
        <CardDescription>Get directly in touch with the team</CardDescription>
        <Separator />
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="grid w-full items-center gap-5">
            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name{" "}
                    <span className="text-[10px]">
                      - Your full name as per IC.
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Muhammad Bin Abdullah"
                      {...field}
                      autoComplete="on"
                      className="capitalize"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      autoComplete="on"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Apply</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g. Digital Marketer"
                      {...field}
                      autoComplete="on"
                      className="capitalize"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
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
                      {files}
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What do you like about us?"
                      {...field}
                      autoComplete="on"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col justify-center items-start gap-5 mt-[2rem]">
            <Button disabled={isSubmitting} type="submit">
              {submitting ? "Submitting..." : "Submit"}
            </Button>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              By submitting the form, you agree to our{" "}
              <span className="underline hover:text-foreground">
                PDPA Notice
              </span>{" "}
              acknowledge and our{" "}
              <span className="underline hover:text-foreground">
                Privacy Policy
              </span>
            </p>

            {notification && (
              <p className="text-sm text-red-500">{notification}</p>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
