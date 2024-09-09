import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <section className="h-screen flex justify-center items-center">
      <Loader className="w-10 h-10 animate-spin" />
    </section>
  );
};

export default Loading;
