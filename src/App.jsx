import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import STLViewer from "./Components/STLViewer";
import Navigation from "./Components/Navigation";

function App() {
  const queryClient = new QueryClient()
  return (
    <>
      {/* <STLViewer/> */}
      <QueryClientProvider client={queryClient}>
        <Navigation />
      </QueryClientProvider>
    </>
  )
}
export default App;