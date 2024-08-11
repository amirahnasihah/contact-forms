import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { getData } from "@/lib/data";
import Link from "next/link";

type DataPageProps = { params: { slug: string[] } };

export default async function SearchBar() {
  const data = await getData("https://jsonplaceholder.typicode.com/posts");

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {data.length > 0 &&
          data.map((item: any) => {
            return (
              <CommandItem key={item.id}>
                <div>
                  <Button>
                    <Link href={"/form-zod"}>{item.title}</Link>
                  </Button>
                </div>
              </CommandItem>
            );
          })}
      </CommandList>
    </Command>
  );
}
