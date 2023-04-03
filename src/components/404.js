import { FriendlyError } from "./Error";

export default function Error404() {
  const message =
    "Sorry, you are not able to view this page. It might be an organization that you do not have permission to access, or it might be an incorrectly typed link.";

  return <FriendlyError title="404 - Not Found" text={message} />;
}
