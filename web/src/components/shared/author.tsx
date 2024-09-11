import { UserType } from "@/data/types";

const Author = ({ author }: { author: UserType }) => {
  return (
    <div className="flex gap-1">
      <p className="text-sm font-light">{author.name}</p>
      <p className="text-sm text-muted-foreground">@{author.username}</p>
    </div>
  );
};

export default Author;
