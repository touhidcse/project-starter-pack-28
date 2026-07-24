import { Button } from "@/components/ui/button";

export default function HomePage() {
  console.log("Root Route");
  return (
   <div>
    Hellow Next JS
    <Button size={"xs"}
      variant={"destructive"}>
      Click me
      </Button>
   </div>
   
  );
}
