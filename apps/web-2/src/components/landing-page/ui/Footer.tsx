import { RiGithubFill } from "@remixicon/react"
import Link from "next/link"
import { siteConfig } from "@/app/siteConfig"
import { WabrixLogo } from "../WabrixLogo"

const Footer = () => {
  const sections = [
    {
      title: "Product",
      items: [
        { label: "Features", href: "/#solutions", external: false },
        { label: "Docs", href: siteConfig.baseLinks.docs, external: false },
        { label: "Setup", href: siteConfig.baseLinks.setup, external: false },
        { label: "Pricing", href: siteConfig.baseLinks.pricing, external: false },
        { label: "Security", href: siteConfig.baseLinks.security, external: false },
      ],
    },
    {
      title: "Project",
      items: [
        { label: "About", href: siteConfig.baseLinks.about, external: false },
        {
          label: "Source code",
          href: siteConfig.repositories.current,
          external: true,
        },
        {
          label: "wabrix-ai (Express + PostgreSQL)",
          href: siteConfig.repositories.rearchitecture,
          external: true,
        },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy Policy", href: siteConfig.baseLinks.privacy, external: false },
        { label: "Terms of Service", href: siteConfig.baseLinks.terms, external: false },
      ],
    },
  ]

  return (
    <div className="px-4 xl:px-0">
      <footer
        id="footer"
        className="relative mx-auto flex max-w-6xl flex-wrap pt-4"
      >
        {/* Vertical Lines */}
        <div className="pointer-events-none inset-0">
          {/* Left */}
          <div
            className="absolute inset-y-0 -my-20 w-px"
            style={{
              maskImage: "linear-gradient(transparent, white 5rem)",
            }}
          >
            <svg className="h-full w-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                className="stroke-gray-300"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </svg>
          </div>

          {/* Right */}
          <div
            className="absolute inset-y-0 right-0 -my-20 w-px"
            style={{
              maskImage: "linear-gradient(transparent, white 5rem)",
            }}
          >
            <svg className="h-full w-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                className="stroke-gray-300"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </svg>
          </div>
        </div>
        <svg
          className="mb-10 h-20 w-full border-y border-dashed border-gray-300 stroke-gray-300"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="diagonal-footer-pattern"
              patternUnits="userSpaceOnUse"
              width="64"
              height="64"
            >
              {Array.from({ length: 17 }, (_, i) => {
                const offset = i * 8
                return (
                  <path
                    key={i}
                    d={`M${-106 + offset} 110L${22 + offset} -18`}
                    stroke=""
                    strokeWidth="1"
                  />
                )
              })}
            </pattern>
          </defs>
          <rect
            stroke="none"
            width="100%"
            height="100%"
            fill="url(#diagonal-footer-pattern)"
          />
        </svg>
        <div className="mr-auto flex w-full justify-between lg:w-fit lg:flex-col">
          <Link
            href="/"
            className="flex items-center font-medium text-gray-700 select-none sm:text-sm"
          >
            <WabrixLogo className="ml-2 w-44" />

            <span className="sr-only">Wabrix Logo (go home)</span>
          </Link>

          <div>
            <div className="mt-4 flex items-center">
              <a
                href={siteConfig.repositories.current}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wabrix source code on GitHub"
                className="rounded-sm p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
              >
                <RiGithubFill className="size-5" />
              </a>
            </div>
            <div className="mt-4 ml-2 max-w-xs text-sm leading-6 text-gray-600">
              <p>Portfolio project and live demo. Not a commercial product.</p>
              <p className="mt-2">
                Source:{" "}
                <a
                  href={siteConfig.repositories.current}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-800 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-gray-900"
                >
                  github.com/ryanakml/wabrix
                </a>
              </p>
            </div>
            <div className="mt-4 ml-2 text-sm text-gray-700">
              &copy; 2026 Wabrix. Personal portfolio project.
            </div>
          </div>
        </div>

        {/* Footer Sections */}
        {sections.map((section) => (
          <div key={section.title} className="mt-10 min-w-44 pl-2 lg:mt-0 lg:pl-0">
            <h3 className="mb-4 font-medium text-gray-900 sm:text-sm">
              {section.title}
            </h3>
            <ul className="space-y-4">
              {section.items.map((item) => (
                <li key={item.label} className="text-sm">
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 transition-colors duration-200 hover:text-gray-900"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-600 transition-colors duration-200 hover:text-gray-900"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
    </div>
  )
}

export default Footer
