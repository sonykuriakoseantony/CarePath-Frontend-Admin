import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { LuLock, LuMail } from "react-icons/lu";
import { IoAlertCircleOutline } from "react-icons/io5";
import { loginAPI } from "../services/allAPI";

function Login() {
  const { isAuthenticated, setAuthorisedUser, setUser } = useAuth();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState({
    email: '',
    passwordHash: '',
  })

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { email, passwordHash } = userDetails
    console.log(email, passwordHash);
    if (email && passwordHash) {
      console.log(email, passwordHash);
      try {
        const result = await loginAPI(userDetails);
        console.log(result);

        //results in 200, 404, 500

        if (result.status == 200) {
          toast.success("Logged in successfully !");
          sessionStorage.setItem("token", result.data.token);
          sessionStorage.setItem("user", JSON.stringify(result.data.user));

          setUserDetails({
            email: '',
            passwordHash: ''
          })

          //Authorised user set in AuthContext
          // Update AuthContext user so protected routes see the change immediately
          setUser && setUser(result.data.user);
          setAuthorisedUser(true);

          const role = (result.data.user?.role || "").toLowerCase();
          setTimeout(() => {
            if (role == 'admin') {
            console.log("Navigating to Admin logged in");
            navigate('/dashboard', { replace: true });
          }
          else if(role == 'review_specialist') {
            navigate('/symptoms', { replace: true });
          }
          }, 2500)
          
        }
        else if (result.status == 401 || result.status == 404) {
          toast.warning(result.response.data.message);
          setUserDetails({
            email: '',
            passwordHash: '',
          })
          navigate('/login');
        }
        else {
          toast.error("Something went wrong. Please try again later !");
          setUserDetails({
            email: '',
            passwordHash: '',
          })
          console.log(result);
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }

    } else {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-background to-muted p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center mb-4">
            <img src="/logo-image.png" alt="Care Path Logo" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            CarePath Admin Portal
          </h1>
          <p className="text-muted-foreground mt-1">
            Admins and Review Specialists can Sign in to access the admin portal
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl border border-border shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <IoAlertCircleOutline className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  placeholder="admin@medcare.com"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={userDetails.passwordHash}
                  onChange={(e) => setUserDetails({ ...userDetails, passwordHash: e.target.value })}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`${!isLoading ? 'cursor-pointer' : ''} w-full h-11 rounded-lg [background:var(--gradient-primary)] text-primary-foreground font-medium shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Demo credentials:{" "}
              <span className="font-medium">admin@carepath.com</span> /{" "}
              <span className="font-medium">admin@123</span>
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Demo credentials:{" "}
              <span className="font-medium">john@carepath.com</span> /{" "}
              <span className="font-medium">john@123</span>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} theme='colored' />
    </div>
  );
}


export default Login