
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Helmet } from "react-helmet"
import { ChevronDown, Lock, Shield, Eye, Users, Cookie, FileText, Bell, Mail, ArrowUp } from "lucide-react"

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState(null)
    const [showScrollTop, setShowScrollTop] = useState(false)

    // Handle scroll events to show/hide the scroll to top button
    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section)
    }

    const sections = [
        {
            id: "information-collected",
            title: "Information We Collect",
            icon: <Eye className="h-6 w-6" />,
            content: (
                <>
                    <p className="text-gray-600 mb-4">
                        We may collect personal information when you use our website, including but not limited to:
                    </p>
                    <ul className="space-y-2 mb-4">
                        {[
                            "Full Name",
                            "Email Address",
                            "Phone Number",
                            "Shipping Address",
                            "Payment Information (if applicable)",
                        ].map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2"
                            >
                                <span className="h-2 w-2 rounded-full bg-red-800 flex-shrink-0"></span>
                                <span>{item}</span>
                            </motion.li>
                        ))}
                    </ul>
                    <p className="text-gray-600">
                        We also collect non-personal information such as browser type, IP address, and pages visited to improve our
                        services and user experience.
                    </p>
                </>
            ),
        },
        {
            id: "information-usage",
            title: "How We Use Your Information",
            icon: <FileText className="h-6 w-6" />,
            content: (
                <>
                    <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {[
                            { title: "Process Orders", desc: "Fulfill your purchases and provide customer support" },
                            { title: "Personalization", desc: "Customize your shopping experience based on preferences" },
                            { title: "Improvement", desc: "Enhance our website functionality and service offerings" },
                            { title: "Communication", desc: "Send updates, offers, and promotional materials" },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                            >
                                <h4 className="font-medium text-red-600 mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-gray-600">
                        We will only use your information for the purposes outlined in this policy unless we obtain your specific
                        consent for other uses.
                    </p>
                </>
            ),
        },
        {
            id: "information-protection",
            title: "How We Protect Your Information",
            icon: <Shield className="h-6 w-6" />,
            content: (
                <>
                    <p className="text-gray-600 mb-4">
                        We implement a variety of security measures to maintain the safety of your personal information:
                    </p>
                    <div className="space-y-3 mb-4">
                        {[
                            { title: "Encryption", desc: "All sensitive information is encrypted using secure SSL technology" },
                            { title: "Secure Servers", desc: "Data is stored on secure servers protected by firewalls" },
                            { title: "Regular Audits", desc: "We conduct security audits to ensure compliance with best practices" },
                            { title: "Limited Access", desc: "Only authorized personnel have access to personal information" },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <p className="text-sm text-blue-700">
                            While we implement these security measures, please be aware that no method of transmission over the
                            internet is 100% secure. We strive to protect your personal information but cannot guarantee absolute
                            security.
                        </p>
                    </div>
                </>
            ),
        },
        {
            id: "information-sharing",
            title: "Sharing Your Information",
            icon: <Users className="h-6 w-6" />,
            content: (
                <>
                    <p className="text-gray-600 mb-4">
                        We do not sell or trade your personal information to third parties. However, we may share your information
                        with:
                    </p>
                    <div className="space-y-3 mb-4">
                        {[
                            "Service providers who assist us in operating our website",
                            "Business partners for specific services with your consent",
                            "Legal authorities when required by law",
                            "Affiliated companies within our corporate family",
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2"
                            >
                                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-red-800 text-xs font-medium">{index + 1}</span>
                                </div>
                                <p className="text-gray-700">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-gray-600">
                        Any third parties with whom we share your information are contractually obligated to keep it confidential
                        and use it only for the purposes for which we disclose it to them.
                    </p>
                </>
            ),
        },
        {
            id: "cookies",
            title: "Cookies",
            icon: <Cookie className="h-6 w-6" />,
            content: (
                <>
                    <p className="text-gray-600 mb-4">
                        We use cookies to enhance your experience while using our website. Cookies are small text files that are
                        stored on your device and help us:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {[
                            "Remember your preferences",
                            "Understand how you use our website",
                            "Personalize content and advertisements",
                            "Analyze website traffic",
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-700 text-sm"
                            >
                                {item}
                            </motion.div>
                        ))}
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-4">
                        <h4 className="font-medium text-amber-800 mb-1">Cookie Management</h4>
                        <p className="text-sm text-amber-700">
                            You can control cookies through your browser settings. However, disabling cookies may limit your ability
                            to use certain features of our website.
                        </p>
                    </div>
                    <p className="text-gray-600">
                        We use both session cookies (which expire when you close your browser) and persistent cookies (which remain
                        on your device until you delete them or they expire).
                    </p>
                </>
            ),
        },
        {
            id: "your-rights",
            title: "Your Rights",
            icon: <Lock className="h-6 w-6" />,
            content: (
                <>
                    <p className="text-gray-600 mb-4">You have several rights regarding your personal information:</p>
                    <div className="space-y-3 mb-4">
                        {[
                            { title: "Access", desc: "Request a copy of the personal information we hold about you" },
                            { title: "Correction", desc: "Request that we correct any inaccurate or incomplete information" },
                            { title: "Deletion", desc: "Request that we delete your personal information" },
                            { title: "Restriction", desc: "Request that we restrict the processing of your information" },
                            { title: "Objection", desc: "Object to the processing of your information" },
                            {
                                title: "Portability",
                                desc: "Request to receive your information in a structured, commonly used format",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <div className="mt-1 flex-shrink-0 h-5 w-5 rounded bg-red-100 flex items-center justify-center text-red-800 text-xs font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-gray-600">
                        To exercise any of these rights, please contact us at{" "}
                        <a href="mailto:khajakhau69@gmail.com" className="text-red-800 hover:underline">
                            khajakhau69@gmail.com
                        </a>
                        .
                    </p>
                </>
            ),
        },
        {
            id: "policy-changes",
            title: "Changes to Our Privacy Policy",
            icon: <Bell className="h-6 w-6" />,
            content: (
                <>
                    <p className="text-gray-600 mb-4">
                        We may update this Privacy Policy from time to time to reflect changes in our practices or for other
                        operational, legal, or regulatory reasons.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">How We'll Notify You</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="h-2 w-2 rounded-full bg-red-800"></span>
                                </span>
                                <span>We'll post the updated policy on this page with a new effective date</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="h-2 w-2 rounded-full bg-red-800"></span>
                                </span>
                                <span>For significant changes, we may send an email notification to registered users</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="h-2 w-2 rounded-full bg-red-800"></span>
                                </span>
                                <span>We may display a notice on our website about the changes</span>
                            </li>
                        </ul>
                    </div>
                    <p className="text-gray-600">
                        Your continued use of our website after any changes to this Privacy Policy constitutes your acceptance of
                        the new terms.
                    </p>
                </>
            ),
        },
        {
            id: "contact-us",
            title: "Contact Us",
            icon: <Mail className="h-6 w-6" />,
            content: (
                <>
                    <p className="text-gray-600 mb-4">
                        If you have any questions or concerns about our Privacy Policy, please don't hesitate to contact us:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center"
                        >
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-3">
                                <Mail className="h-5 w-5 text-red-800" />
                            </div>
                            <h4 className="font-medium text-gray-800 mb-1">Email</h4>
                            <a href="mailto:khajakhau69@gmail.com" className="text-red-800 hover:underline">
                                khajakhau69@gmail.com
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center"
                        >
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-red-800"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                            </div>
                            <h4 className="font-medium text-gray-800 mb-1">Phone</h4>
                            <a href="tel:+9779765379732" className="text-red-800 hover:underline">
                                +977 9765379732
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center"
                        >
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-red-800"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-medium text-gray-800 mb-1">Address</h4>
                            <p className="text-gray-600">Itahari, Nepal</p>
                        </motion.div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-red-600 text-center">
                            We aim to respond to all inquiries within 48 hours during business days.
                        </p>
                    </div>
                </>
            ),
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
            <Helmet>
                <title>Privacy Policy | Khaja Hub</title>
                <meta
                    name="description"
                    content="Learn about how we collect, use, and protect your personal information at Khaja Khau."
                />
            </Helmet>

            {/* Header */}
            <div className="bg-red-800 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 800 800">
                        <path
                            d="M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63"
                            stroke="currentColor"
                            strokeWidth="100"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </svg>
                </div>
                <div className="container mx-auto max-w-4xl relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Privacy Policy</h1>
                        <p className="text-lg md:text-xl text-red-100 max-w-3xl mx-auto text-center">
                            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Contents</h3>
                                <nav className="space-y-1">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <span className="text-red-800">{section.icon}</span>
                                            <span>{section.title}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                <h3 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Your Data Security
                                </h3>
                                <p className="text-sm text-red-600">
                                    We're committed to protecting your personal information and being transparent about how we use it.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3 space-y-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-sm p-6 mb-6"
                        >
                            <p className="text-lg text-gray-700 leading-relaxed">
                                This Privacy Policy explains how Khaja Hub ("we", "us", or "our") collects, uses, and protects your
                                personal information when you visit our website or use our services. We respect your privacy and are
                                committed to protecting your personal data.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed mt-4">
                                Please read this Privacy Policy carefully to understand our policies and practices regarding your
                                information. By accessing or using our services, you agree to this Privacy Policy.
                            </p>
                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                <p className="text-sm text-yellow-800">
                                    <strong>Last Updated:</strong> May 15, 2023
                                </p>
                            </div>
                        </motion.div>

                        {sections.map((section) => (
                            <div key={section.id} id={section.id} className="scroll-mt-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                                >
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-800">
                                                {section.icon}
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                                        </div>
                                        <ChevronDown
                                            className={`h-5 w-5 text-gray-500 transition-transform ${activeSection === section.id ? "transform rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {(activeSection === section.id || activeSection === null) && (
                                        <div className="p-6 border-t border-gray-100">{section.content}</div>
                                    )}
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 py-8 px-4">
                <div className="container mx-auto max-w-5xl text-center">
                    <p className="text-gray-600 mb-4">
                        If you have any questions about this Privacy Policy, please contact us at{" "}
                        <a href="mailto:khajakhau69@gmail.com" className="text-red-800 hover:underline">
                            khajakhau69@gmail.com
                        </a>
                    </p>
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} Khaja Hub. All rights reserved.</p>
                </div>
            </div>

            {/* Scroll to top button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: showScrollTop ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-red-800 text-white shadow-lg flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
                aria-label="Scroll to top"
                style={{ display: showScrollTop ? "flex" : "none" }}
            >
                <ArrowUp className="h-5 w-5" />
            </motion.button>
        </div>
    )
}

export default PrivacyPolicy
