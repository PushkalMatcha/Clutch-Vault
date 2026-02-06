import { useRouter } from "next/navigation";

/**
 * Utility function to check if the user is logged in.
 * @returns {boolean} - Returns true if the user is logged in, otherwise false.
 */
// Ensure the isUserLoggedIn function checks for a valid authToken
// Added debug logs to trace the behavior of isUserLoggedIn and handleTournamentsClick
export function isUserLoggedIn() {
  if (typeof window === "undefined") {
    console.log("isUserLoggedIn: Executed on server, returning false.");
    return false; // Return false if executed on the server
  }

  const authToken = localStorage.getItem("authToken");
  console.log("isUserLoggedIn: authToken =", authToken);

  if (!authToken) {
    console.log("isUserLoggedIn: User is not logged in.");
    return false;
  }

  try {
    // Optionally, decode and validate the token here if needed
    console.log("isUserLoggedIn: User is logged in.");
    return true;
  } catch (error) {
    console.error("isUserLoggedIn: Error validating authToken.", error);
    return false;
  }
}

/**
 * Handles click events for the tournaments link.
 * Redirects to login if the user is not logged in.
 * @param {React.MouseEvent<HTMLAnchorElement, MouseEvent>} e - The click event.
 * @param {string} redirectUrl - The URL to redirect to after login.
 */
// Fix the use of .then and .catch on router.push and add proper error handling
export const handleTournamentsClick = (
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
  router: ReturnType<typeof useRouter>,
  redirectUrl: string = "/tournaments"
) => {
  e.preventDefault(); // Ensure default navigation is prevented

  if (typeof window === "undefined") {
    console.log("handleTournamentsClick: Executed on server, skipping.");
    return; // Prevent execution on the server
  }

  const authToken = localStorage.getItem("authToken");
  console.log("handleTournamentsClick: authToken =", authToken);

  const isLoggedIn = !!authToken;
  console.log("handleTournamentsClick: isLoggedIn =", isLoggedIn);

  if (!isLoggedIn) {
    console.log("handleTournamentsClick: Redirecting to login page.");
    try {
      router.push(`/login?redirect=${redirectUrl}`);
    } catch (err: unknown) {
      console.error("handleTournamentsClick: Redirect to login failed.", err);
    }
  } else {
    console.log("handleTournamentsClick: Redirecting to tournaments page.");
    try {
      router.push(redirectUrl);
    } catch (err: unknown) {
      console.error("handleTournamentsClick: Redirect to tournaments failed.", err);
    }
  }
};