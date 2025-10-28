import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import axios from "../../Config/axios.js";
import { useNavigate } from "react-router-dom";

const Login = ({ setUserDetail }) => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/login/salesman", form, {
        withCredentials: true,
      });
      console.log("Response:", res.data); // Debugging the response

      if (res?.data?.status) {
        setUserDetail(res.data); // Save user details
        localStorage.setItem("userData", JSON.stringify(res.data)); // Save to localStorage

        navigate("/"); // Redirect to the Dashboard
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your Username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, username: e.target.value }));
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, password: e.target.value }));
                  }}
                />
              </div>
            </div>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Login;
