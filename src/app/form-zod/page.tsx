import { Separator } from "@/components/ui/separator";
import FormZod from "./FormZod";

export default function FormPage() {
  return (
    <div>
      <h1>Form with zod</h1>

      {/* FormFileTemplate with file and with zod */}
      <FormZod />
    </div>
  );
}
