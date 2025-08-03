import React, { useState } from "react";
import { Input, InputProps } from "../ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";



const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {

        const [ showPassword, setShowPassword ] = useState(false);  
        
        return (
            <div className="relative">
                <Input
                   type={showPassword ? "text" : "password"}
                   className={ cn(" pe-12 ", { className }) }
                   ref={ref}
                   {...props}   
                />

                     <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword) }
                      title={showPassword ? "Hide Password" : "Show Password"}
                        className=" absolute top-1/2 right-4 transform  -translate-y-1/2 text-muted-foreground"
                       >
                          {
                             showPassword ? (
                                <EyeOff size={21} className="ml-9" />
                             ) : (
                                <Eye size={21} />
                             )
                          }
                       </button>


            </div>
        )
        
    }
)


PasswordInput.displayName = "PasswordInput";

export { PasswordInput }