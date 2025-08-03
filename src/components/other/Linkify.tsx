import { Component } from "lucide-react";
import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkWithTooltip from "./UserLinkWithTooltip";


interface LinkifyProps {
    children: React.ReactNode;
}


export default function Linkify ({ children }: LinkifyProps) {

    return (
        <LinkifyUserName>
        <LinkifyHashtag>
        <LinkifyUrl>
           { children }
        </LinkifyUrl>
        </LinkifyHashtag>
        </LinkifyUserName>
    )
}



function LinkifyUrl ({ children }: LinkifyProps) {

    return (
        <LinkItUrl className=" text-primary  font-medium  hover:underline " >
           { children }
        </LinkItUrl>
    )
  
}



function LinkifyUserName ({ children }: LinkifyProps) {
    return (
        <LinkIt regex={/(@[a-zA-Z0-9_-]+)/}
             component={( match, key ) => {
                const username = match.slice(1);

                return (
                    <UserLinkWithTooltip
                       key={key}
                       username={match.slice(1)}
                    >
                        { match }
                    </UserLinkWithTooltip>
                )
             }} 
            >
                { children }
        
        </LinkIt>
    )
}



function LinkifyHashtag ({ children }: LinkifyProps) {
    return (
        <LinkIt
           regex={/(#[a-zA-Z0-9_-]+)/}
           component={( match, key ) => (
              <Link
                key={key}
                href={`/hashtag/${match.slice(1)}`}
                className=" text-primary font-medium hover:underline "
              >
                { match }
              </Link>
           )}
        >
          { children }
        </LinkIt>
    )
}