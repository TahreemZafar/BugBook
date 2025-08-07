/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
    serverExternalPackages: ["@node-rs/argon2"],
    
    images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'qtgj3djtvx.ufs.sh',
      pathname: '/**'
    },
    {
      protocol: 'https',
      hostname: 'utfs.io',
      pathname: '/**'
    }
  ]
},
    

    rewrites: () => {
      return [
         {
           source: "/hashtag/:tag",
            destination: "/search?q=%23:tag"
         }
      ]
    }

};

export default nextConfig;
