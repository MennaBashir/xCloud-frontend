import { RouterProvider } from "react-router-dom";
import { router } from "./shared/router";
import { Toaster } from "@/components/ui/sonner";

function App() {
	return (
		<>
			<RouterProvider router={router} />
			<Toaster />
		</>
	);
}

export default App;
