import { AuthProvider } from "./components/auth/provider";
import { Layout } from "./components/layout";
import { PageProvider } from "./contexts/page.context";

function App() {
  return (
    <PageProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </PageProvider>
  )
}

export default App
