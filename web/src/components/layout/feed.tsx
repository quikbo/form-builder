import Header from "./header";
import Forms from "../form/forms";
import Fields from "../field/fields";
import { useStore } from "@nanostores/react";
import { $router } from "@/lib/router";
import Responses from "../response/responses";

const Feed = () => {
  const page = useStore($router);

  if (!page) return null; //handle case when user navigates to
  //non existing page

  if (page.route === "home") {
    return (
      <div className="flex flex-col w-full min-h-screen border-x">
        <Header />
        <Forms />
      </div>
    );
  } else if (page.route === "form") {
    return (
      <div className="flex flex-col w-full min-h-screen border-x">
        <Header />
        <Fields formId={page.params.formId} />
      </div>
    );
  } else if (page.route === "responses") { // Add new condition for responses route
    return (
      <div className="flex flex-col w-full min-h-screen border-x">
        <Header />
        <Responses formId={page.params.formId} /> {/* Render Responses component */}
      </div>
    );
  }
};

export default Feed;
