import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import { supabase, getAuthToken } from '../lib/supabase'

const tools = [
    {
        id: 'architecture',
        name: 'System Architecture',
        description: 'Design microservices, APIs, and infrastructure diagrams',
        icon: 'architecture',
        color: 'blue',
        gradient: 'from-blue-500 to-blue-600',
        enabled: true,
        apiUrl: 'https://xiron-app.onrender.com/api/generate-architecture',
        resultKey: 'architecture'
    },
    {
        id: 'userflow',
        name: 'User Flow',
        description: 'Map user journeys and interaction flows',
        icon: 'userflow',
        color: 'purple',
        gradient: 'from-purple-500 to-purple-600',
        enabled: true,
        apiUrl: 'https://xiron-app.onrender.com/api/generate-userflow',
        resultKey: 'userflow'
    },
    {
        id: 'database',
        name: 'Database Schema',
        description: 'Create optimized database structures and relationships',
        icon: 'database',
        color: 'green',
        gradient: 'from-green-500 to-green-600',
        enabled: true,
        apiUrl: 'https://xiron-app.onrender.com/api/generate-database',
        resultKey: 'schema'
    },
    {
        id: 'prd',
        name: 'PRD Generator',
        description: 'Generate comprehensive product requirement documents',
        icon: 'prd',
        color: 'orange',
        gradient: 'from-orange-500 to-orange-600',
        enabled: true,
        apiUrl: 'https://xiron-app.onrender.com/api/generate-prd',
        resultKey: 'prd'
    }
]

const UPDATE_CREDIT_COST = 10 // Credits required per report update

// Plan-specific credit costs
const PLAN_CREDIT_COSTS = {
    free: { SINGLE_REPORT: 20, BUNDLE: 70 },
    starter: { SINGLE_REPORT: 20, BUNDLE: 70 },
    pro: { SINGLE_REPORT: 30, BUNDLE: 90 }
}

// Helper to get credit cost based on plan
const getCreditCost = (plan, operation) => {
    const planCosts = PLAN_CREDIT_COSTS[plan] || PLAN_CREDIT_COSTS.free
    return planCosts[operation] || PLAN_CREDIT_COSTS.free[operation]
}

// Plan-based feature configuration
const PLAN_FEATURES = {
    free: {
        name: 'Free',
        monthlyCredits: 50,
        canDownload: false,
        canUpdate: false,
        canUseBundle: false,
        freeUpdates: 0,
        reportQuality: 'basic',
        creditCostReport: 20,
        creditCostBundle: 70
    },
    starter: {
        name: 'Starter',
        monthlyCredits: 120,
        canDownload: true,
        canUpdate: true,
        canUseBundle: true,
        freeUpdates: 1,
        reportQuality: 'deep',
        creditCostReport: 20,
        creditCostBundle: 70
    },
    pro: {
        name: 'Pro',
        monthlyCredits: 240,
        canDownload: true,
        canUpdate: true,
        canUseBundle: true,
        freeUpdates: 3,
        reportQuality: 'deep',
        creditCostReport: 30,
        creditCostBundle: 90
    }
}

function Dashboard({ user }) {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentTool, setCurrentTool] = useState(null)
    const [projectName, setProjectName] = useState('')
    const [description, setDescription] = useState('')
    const [aiPowered, setAiPowered] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [showResultModal, setShowResultModal] = useState(false)
    const [showQuestionsModal, setShowQuestionsModal] = useState(false)
    const [question1, setQuestion1] = useState('')
    const [question2, setQuestion2] = useState('')
    const [question3, setQuestion3] = useState('')
    const [question4, setQuestion4] = useState('')
    const [question5, setQuestion5] = useState('')
    const [question6, setQuestion6] = useState('')
    const [question7, setQuestion7] = useState('')
    const [question8, setQuestion8] = useState('')
    const [question9, setQuestion9] = useState('')
    const [question10, setQuestion10] = useState('')
    const [documents, setDocuments] = useState([])
    const [showSettingsSidebar, setShowSettingsSidebar] = useState(false)
    const [userCredits, setUserCredits] = useState(0)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [newFeatures, setNewFeatures] = useState('')
    const [isUpdating, setIsUpdating] = useState(false)
    const [userPlan, setUserPlan] = useState('free')
    const [freeUpdatesRemaining, setFreeUpdatesRemaining] = useState(0)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [upgradeFeature, setUpgradeFeature] = useState('')
    const [showBundleModal, setShowBundleModal] = useState(false)
    const [bundleStep, setBundleStep] = useState(1) // Step 1: name/desc, Step 2: questions
    const [bundleLoading, setBundleLoading] = useState(false)
    const [bundleResult, setBundleResult] = useState(null)
    const [deleteConfirmActive, setDeleteConfirmActive] = useState(false)
    const [deleteCountdown, setDeleteCountdown] = useState(5)
    const [activeView, setActiveView] = useState('dashboard') // 'dashboard', 'templates', 'documents'

    const mockTemplates = [
        {
            id: 1,
            title: "E-commerce System Architecture",
            description: "Complete architecture for scalable e-commerce platforms",
            type: "System Architecture",
            toolId: "architecture",
            time: "2 days ago",
            uses: 45,
            icon: "architecture",
            color: "blue"
        },
        {
            id: 2,
            title: "User Onboarding Flow",
            description: "Step-by-step user onboarding experience template",
            type: "User Flow",
            toolId: "userflow",
            time: "5 days ago",
            uses: 32,
            icon: "userflow",
            color: "purple"
        },
        {
            id: 3,
            title: "SaaS Database Schema",
            description: "Multi-tenant SaaS database structure",
            type: "Database Schema",
            toolId: "database",
            time: "1 week ago",
            uses: 28,
            icon: "database",
            color: "green"
        },
        {
            id: 4,
            title: "Mobile App PRD",
            description: "Product requirements for mobile applications",
            type: "PRD",
            toolId: "prd",
            time: "3 days ago",
            uses: 56,
            icon: "prd",
            color: "orange"
        },
        {
            id: 5,
            title: "Microservices Architecture",
            description: "Distributed microservices system design",
            type: "System Architecture",
            toolId: "architecture",
            time: "4 days ago",
            uses: 41,
            icon: "architecture",
            color: "blue"
        },
        {
            id: 6,
            title: "Payment Flow Template",
            description: "Secure payment processing workflow",
            type: "User Flow",
            toolId: "userflow",
            time: "1 day ago",
            uses: 63,
            icon: "userflow",
            color: "purple"
        }
    ]

    // Document history UI state
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
    const [activeDropdown, setActiveDropdown] = useState(null)

    // Load documents and credits when user changes
    useEffect(() => {
        if (user) {
            loadDocuments(user.id)
            loadUserCredits(user.id)
        }
    }, [user])

    // Load user credits and plan from Supabase
    const loadUserCredits = async (userId) => {
        if (!userId) return

        try {
            const { data, error } = await supabase
                .from('user_credits')
                .select('credits, plan, free_updates_remaining')
                .eq('user_id', userId)
                .single()

            if (error) {
                // If no record exists, create one with default values
                if (error.code === 'PGRST116') {
                    const { data: newData, error: insertError } = await supabase
                        .from('user_credits')
                        .insert({ user_id: userId, credits: 50, plan: 'free', free_updates_remaining: 0 })
                        .select('credits, plan, free_updates_remaining')
                        .single()

                    if (!insertError && newData) {
                        setUserCredits(newData.credits)
                        setUserPlan(newData.plan || 'free')
                        setFreeUpdatesRemaining(newData.free_updates_remaining || 0)
                    }
                } else {
                    console.error('Error loading credits:', error)
                }
                return
            }

            if (data) {
                setUserCredits(data.credits)
                setUserPlan(data.plan || 'free')
                setFreeUpdatesRemaining(data.free_updates_remaining || 0)
            }
        } catch (err) {
            console.error('Error loading credits:', err)
        }
    }

    // Deduct credits after successful generation
    const deductCredits = async (userId, amount) => {
        try {
            const newCredits = userCredits - amount
            const { error } = await supabase
                .from('user_credits')
                .update({ credits: newCredits, updated_at: new Date().toISOString() })
                .eq('user_id', userId)

            if (!error) {
                setUserCredits(newCredits)
            }
        } catch (err) {
            console.error('Error deducting credits:', err)
        }
    }

    const getQuestionsForTool = (toolId) => {
        const questions = {
            prd: {
                q1: 'What features are absolutely essential for launch vs. nice-to-have later?',
                q1Placeholder: 'e.g., Essential: user login, checkout, product listing. Nice-to-have: wishlist, reviews, social sharing...',
                q2: 'Who are your competitors or what alternatives exist?',
                q2Placeholder: 'e.g., Direct competitors: Amazon, Flipkart. Alternatives: local stores, other marketplaces...',
                q3: 'Who are your target users and what problem are you solving for them?',
                q3Placeholder: 'e.g., Small business owners who struggle to manage inventory. Busy parents who need quick meal planning...',
                q4: 'What is your timeline and budget for this project?',
                q4Placeholder: 'e.g., MVP in 3 months with $10K budget. Full launch in 6 months. Bootstrap with minimal budget...',
                q5: 'How will you know if your product is successful?',
                q5Placeholder: 'e.g., 1000 active users in first month, 50 paid subscriptions, positive user reviews, revenue targets...',
                // Pro-only questions
                q6: 'What monetization strategy do you plan to use?',
                q6Placeholder: 'e.g., Freemium model, subscription tiers, one-time purchase, ads, marketplace commission...',
                q7: 'What compliance or regulatory requirements apply to your product?',
                q7Placeholder: 'e.g., GDPR for EU users, HIPAA for health data, PCI-DSS for payments, SOC2 for enterprise...'
            },
            architecture: {
                q1: 'Do you need this accessible on web, mobile app, or both?',
                q1Placeholder: 'e.g., Web only, Mobile app (iOS & Android), Both web and mobile, Progressive Web App (PWA)...',
                q2: 'What are the key technical constraints or requirements?',
                q2Placeholder: 'e.g., Must use cloud infrastructure, need real-time processing, compliance requirements...',
                q3: 'What is the expected number of users initially and in 1-2 years?',
                q3Placeholder: 'e.g., Initially 100-500 users, expecting 10,000+ in 1 year, 50,000+ in 2 years...',
                q4: 'Do you need any third-party integrations (payment gateways, email services, APIs)?',
                q4Placeholder: 'e.g., Stripe/Razorpay for payments, SendGrid for emails, Google Maps API, OAuth login...',
                q5: 'What is your hosting preference - cloud-based or do you have your own servers?',
                q5Placeholder: 'e.g., AWS/GCP/Azure cloud, own dedicated servers, hybrid approach, Vercel/Netlify...',
                // Pro-only questions
                q6: 'What are the top 3 non‑negotiable outcomes this system must guarantee?',
                q6Placeholder: 'example: low latency for AI responses, strict cost control, 99.9% uptime, easy onboarding for non-tech users, strong data privacy, etc.',
                q7: 'What real‑world scale should this architecture be designed for in the next 12–18 months?',
                q7Placeholder: 'Example details: expected monthly active users, peak concurrent users, average reports/jobs per day, target regions, and acceptable monthly infra budget.'
            },
            database: {
                q1: 'What are the main things you need to track (customers, products, orders, etc.)?',
                q1Placeholder: 'e.g., Users, Products, Orders, Payments, Reviews, Categories, Addresses, Inventory...',
                q2: 'How many users do you expect to use this?',
                q2Placeholder: 'e.g., Starting with 100 users, expecting 10,000 in first year, enterprise with 50,000+ users...',
                q3: 'What reports or data searches will you need to run frequently?',
                q3Placeholder: 'e.g., Sales by date range, user activity reports, inventory levels, order status searches...',
                q4: 'What information do you need to store about each of these things?',
                q4Placeholder: 'e.g., Users: name, email, phone, address. Products: title, price, description, images, stock...',
                q5: 'Is there any sensitive data that needs special protection?',
                q5Placeholder: 'e.g., Passwords (hashed), payment cards (PCI compliance), personal info (GDPR), medical data (HIPAA)...',
                // Pro-only questions
                q6: 'What are your data retention and archival requirements?',
                q6Placeholder: 'e.g., Keep active data 2 years, archive after 2 years, delete after 7 years, audit log retention...',
                q7: 'Do you need real-time data sync, caching, or search capabilities?',
                q7Placeholder: 'e.g., Redis caching for sessions, Elasticsearch for product search, real-time websocket updates...'
            },
            userflow: {
                q1: 'What is the main task each user type needs to accomplish?',
                q1Placeholder: 'e.g., Customers: browse and purchase products. Admins: manage inventory. Sellers: list products...',
                q2: 'What are the stages in the user journey?',
                q2Placeholder: 'e.g., Discovery → Registration → Browse → Add to Cart → Checkout → Payment → Order Tracking...',
                q3: 'What information does the user need to see at each step?',
                q3Placeholder: 'e.g., Product page: price, reviews, stock. Checkout: order summary, shipping options. Confirmation: order ID, tracking...',
                q4: 'What will be the step by step new user journey?',
                q4Placeholder: 'e.g., Landing page → Sign up form → Email verification → Profile setup → Welcome tutorial → Dashboard...',
                q5: 'What will be the returning user (existing account) step by step journey?',
                q5Placeholder: 'e.g., Login page → Dashboard → Recent orders → Continue shopping → Quick checkout → Order confirmation...',
                // Pro-only questions
                q6: 'Which user persona should be the primary focus??',
                q6Placeholder: 'students, freelance developers, content creators, SMEs',
                q7: 'write a detail description of the user scenario?',
                q7Placeholder: 'e.g., suriya a student he need to buy a book from the library he use my app to buy a book... ',
            }
        }
        return questions[toolId] || questions.prd
    }

    const handleCreateNew = (toolId) => {
        const tool = tools.find(t => t.id === toolId)
        if (tool && tool.enabled) {
            setCurrentTool(tool)
            setIsModalOpen(true)
        } else {
            alert(`${tool?.name || 'This tool'} is coming soon!`)
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentTool(null)
        setProjectName('')
        setDescription('')
        setAiPowered(false)
        setError(null)
        setShowQuestionsModal(false)
        setQuestion1('')
        setQuestion2('')
        setQuestion3('')
        setQuestion4('')
        setQuestion5('')
        setQuestion6('')
        setQuestion7('')
    }

    const handleContinue = () => {
        if (!projectName.trim() || !description.trim()) {
            setError('Please fill in both project name and description')
            return
        }

        setIsModalOpen(false)
        setError(null)
        setShowQuestionsModal(true)
    }

    const handleSubmitQuestions = async () => {
        if (!question1.trim() || !question2.trim()) {
            setError('Please answer both questions')
            return
        }

        if (!currentTool || !currentTool.apiUrl) {
            setError('Invalid tool configuration')
            return
        }

        // Check if user has enough credits (plan-specific)
        const reportCost = getCreditCost(userPlan, 'SINGLE_REPORT')
        if (userCredits < reportCost) {
            setError(`Insufficient credits. You need ${reportCost} credits to generate a report. You have ${userCredits} credits.`)
            return
        }

        setIsLoading(true)
        setError(null)
        setShowQuestionsModal(false)

        try {
            const token = await getAuthToken()

            if (!token) {
                setError('Please log in to generate documents')
                setShowQuestionsModal(true)
                return
            }

            const response = await fetch(currentTool.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    projectName,
                    description,
                    aiPowered,
                    question1,
                    question2,
                    question3,
                    question4,
                    question5,
                    question6: userPlan === 'pro' ? question6 : '',
                    question7: userPlan === 'pro' ? question7 : '',
                    plan: userPlan  // Send user's plan for plan-based prompts
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                const errorMessage = errorData.message || errorData.error || `Failed to generate ${currentTool.name}`

                if (errorMessage.includes('credit balance') || errorMessage.includes('credits') || errorMessage.includes('quota')) {
                    throw new Error(`API Credits Insufficient: Please add credits to continue generating ${currentTool.name}.`)
                }

                throw new Error(errorMessage)
            }

            const data = await response.json()
            const documentData = {
                ...data,
                toolName: currentTool.name,
                toolId: currentTool.id,
                content: data[currentTool.resultKey] || data.prd || data.architecture || data.schema || data.userflow,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            }

            if (user) {
                try {
                    const { data: savedDoc, error: saveError } = await supabase
                        .from('documents')
                        .insert({
                            user_id: user.id,
                            project_name: documentData.projectName,
                            tool_name: documentData.toolName,
                            tool_id: documentData.toolId,
                            content: documentData.content,
                            created_at: documentData.createdAt
                        })
                        .select()
                        .single()

                    if (!saveError && savedDoc) {
                        documentData.id = savedDoc.id
                        documentData.dbId = savedDoc.id
                    }
                } catch (saveErr) {
                    console.error('Error saving document to database:', saveErr)
                }
            }

            setDocuments(prev => [documentData, ...prev])
            setResult(documentData)
            setShowResultModal(true)
            setProjectName('')
            setDescription('')
            setAiPowered(false)
            setQuestion1('')
            setQuestion2('')
            setQuestion3('')
            setQuestion4('')
            setQuestion5('')

            // Credits are now deducted SERVER-SIDE
            // Update local state from the API response
            if (data.creditsRemaining !== undefined) {
                setUserCredits(data.creditsRemaining)
            }
        } catch (err) {
            console.error(`Error generating ${currentTool.name}:`, err)
            setError(err.message || `An error occurred while generating ${currentTool.name}`)
            setShowQuestionsModal(true)
        } finally {
            setIsLoading(false)
        }
    }


    const handleCloseResultModal = () => {
        setShowResultModal(false)
        setResult(null)
        setCurrentTool(null)
    }

    const handleViewDocument = (document) => {
        setResult(document)
        setShowResultModal(true)
    }

    const handleDownloadReport = () => {
        if (!result) return

        const content = result.content || ''
        const fileName = `${result.projectName.replace(/[^a-z0-9]/gi, '_')}_${result.toolId || 'document'}.md`

        const blob = new Blob([content], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // Handle Developer Bundle Generation
    const handleGenerateBundle = async () => {
        console.log('handleGenerateBundle called');
        console.log('projectName:', projectName);
        console.log('description:', description);

        if (!projectName.trim() || !description.trim()) {
            setError('Please fill in project name and description')
            return
        }

        // Check credits for bundle (plan-specific)
        const bundleCost = getCreditCost(userPlan, 'BUNDLE')
        if (userCredits < bundleCost) {
            setError(`Insufficient credits. You need ${bundleCost} credits for a bundle. You have ${userCredits} credits.`)
            return
        }

        setBundleLoading(true)
        setError(null)
        setShowBundleModal(false)

        try {
            const token = await getAuthToken()
            if (!token) {
                setError('Please log in to generate bundle')
                setShowBundleModal(true)
                setBundleLoading(false)
                return
            }

            const response = await fetch('https://xiron-app.onrender.com/api/generate-bundle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    projectName,
                    description,
                    question1,
                    question2,
                    question3,
                    question4,
                    question5,
                    question6,
                    question7,
                    question8: userPlan === 'pro' ? question8 : '',
                    question9: userPlan === 'pro' ? question9 : '',
                    question10: userPlan === 'pro' ? question10 : '',
                    plan: userPlan
                }),
            })

            console.log('API Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json()
                console.log('API Error:', errorData);
                throw new Error(errorData.message || 'Failed to generate bundle')
            }

            const data = await response.json()
            console.log('API Success data:', data);

            // Save all 4 documents to database
            console.log('Saving documents to database...');
            console.log('data.bundle:', data.bundle);
            console.log('User:', user?.id);

            if (user && data.bundle) {
                const toolMap = {
                    prd: { name: 'PRD Generator (Developer Bundle)', id: 'prd' },
                    architecture: { name: 'System Architecture (Developer Bundle)', id: 'architecture' },
                    database: { name: 'Database Schema (Developer Bundle)', id: 'database' },
                    userflow: { name: 'User Flow (Developer Bundle)', id: 'userflow' }
                }

                for (const [type, content] of Object.entries(data.bundle)) {
                    const tool = toolMap[type]
                    console.log(`Saving ${type}:`, tool, 'Content length:', content?.length);

                    if (!tool) {
                        console.error(`Unknown document type: ${type}`);
                        continue;
                    }

                    const { data: insertData, error: insertError } = await supabase
                        .from('documents')
                        .insert({
                            user_id: user.id,
                            project_name: projectName,
                            tool_name: tool.name,
                            tool_id: tool.id,
                            content: content,
                            created_at: new Date().toISOString()
                        })
                        .select()
                        .single()

                    if (insertError) {
                        console.error(`Error saving ${type}:`, insertError);
                    }
                }

                // Credits are now deducted SERVER-SIDE
                // Update local state from the API response
                if (data.creditsRemaining !== undefined) {
                    setUserCredits(data.creditsRemaining)
                }

                // Refresh documents list
                loadDocuments(user.id)
            } else {
                console.error('Cannot save: user or bundle missing', { user: !!user, bundle: !!data.bundle });
            }

            setBundleResult(data)
            alert(`Developer Bundle generated successfully!\n\n4 documents created:\n• PRD\n• System Architecture\n• Database Schema\n• User Flow\n\nCheck your history to view them.`)

            // Reset form
            setProjectName('')
            setDescription('')
            setQuestion1('')
            setQuestion2('')
            setQuestion3('')
            setQuestion4('')
            setQuestion5('')
            setQuestion6('')
            setQuestion7('')
            setQuestion8('')
            setQuestion9('')
            setQuestion10('')

        } catch (err) {
            console.error('Bundle generation error:', err)
            setError(err.message)
            setShowBundleModal(true)
        } finally {
            setBundleLoading(false)
        }
    }

    const handleUpdateReport = async () => {
        if (!newFeatures.trim()) {
            setError('Please describe the new features you want to add')
            return
        }

        // Check if user has free updates or enough credits
        const hasFreeUpdate = freeUpdatesRemaining > 0
        if (!hasFreeUpdate && userCredits < UPDATE_CREDIT_COST) {
            setError(`Insufficient credits. You need ${UPDATE_CREDIT_COST} credits. You have ${userCredits} credits.`)
            return
        }

        if (!result) {
            setError('No document selected for update')
            return
        }

        setIsUpdating(true)
        setError(null)

        try {
            const token = await getAuthToken()

            if (!token) {
                setError('Please log in to update documents')
                setIsUpdating(false)
                return
            }

            // Find the tool for this document
            const tool = tools.find(t => t.id === result.toolId)
            if (!tool) {
                setError('Invalid document type')
                setIsUpdating(false)
                return
            }

            // Create updated description with new features
            const updatedDescription = `${result.projectName} - UPDATE REQUEST:\n\nPrevious content to enhance:\n${result.content?.substring(0, 500)}...\n\nNEW FEATURES TO ADD:\n${newFeatures}`

            const response = await fetch(tool.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    projectName: result.projectName + ' (Updated)',
                    description: updatedDescription,
                    aiPowered: true,
                    question1: `This is an update to an existing ${tool.name}. Please incorporate the new features while maintaining consistency with the original document.`,
                    question2: newFeatures,
                    plan: userPlan
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || errorData.error || 'Failed to update document')
            }

            const data = await response.json()

            // Count existing updates for this project to get version number
            const baseProjectName = result.projectName.replace(/ - Updated \d+$/, '')
            const existingUpdates = documents.filter(doc =>
                doc.projectName.startsWith(baseProjectName) &&
                doc.projectName.includes(' - Updated')
            ).length
            const updateNumber = existingUpdates + 1

            const updatedDocument = {
                ...result,
                content: data[tool.resultKey] || data.prd || data.architecture || data.schema || data.userflow,
                projectName: `${baseProjectName} - Updated ${updateNumber}`,
                createdAt: new Date().toISOString()
            }

            // Save to database if user is logged in
            if (user) {
                try {
                    const { data: savedDoc, error: saveError } = await supabase
                        .from('documents')
                        .insert({
                            user_id: user.id,
                            project_name: updatedDocument.projectName,
                            tool_name: updatedDocument.toolName,
                            tool_id: updatedDocument.toolId,
                            content: updatedDocument.content,
                            created_at: updatedDocument.createdAt
                        })
                        .select()
                        .single()

                    if (!saveError && savedDoc) {
                        updatedDocument.id = savedDoc.id
                        updatedDocument.dbId = savedDoc.id
                    }
                } catch (saveErr) {
                    console.error('Error saving updated document:', saveErr)
                }

                // Use free update or deduct credits
                if (freeUpdatesRemaining > 0) {
                    // Use a free update
                    const newFreeUpdates = freeUpdatesRemaining - 1
                    const { error: updateError } = await supabase
                        .from('user_credits')
                        .update({ free_updates_remaining: newFreeUpdates })
                        .eq('user_id', user.id)

                    if (!updateError) {
                        setFreeUpdatesRemaining(newFreeUpdates)
                    }
                } else {
                    // Deduct credits for update (10 credits)
                    await deductCredits(user.id, UPDATE_CREDIT_COST)
                }
            }

            // Add to documents list
            setDocuments(prev => [updatedDocument, ...prev])

            // Update the result to show updated version
            setResult(updatedDocument)

            // Close update modal
            setShowUpdateModal(false)
            setNewFeatures('')

        } catch (err) {
            console.error('Error updating document:', err)
            setError(err.message || 'An error occurred while updating the document')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteDocument = async (e, document) => {
        e.stopPropagation()

        if (!window.confirm(`Are you sure you want to delete "${document.projectName}"? This action cannot be undone.`)) {
            return
        }

        try {
            if (user && document.dbId) {
                const { error } = await supabase
                    .from('documents')
                    .delete()
                    .eq('id', document.dbId)

                if (error) {
                    console.error('Error deleting document from database:', error)
                    alert('Failed to delete document from database. Please try again.')
                    return
                }
            }

            setDocuments(prev => prev.filter(doc => doc.id !== document.id))

            if (result?.id === document.id) {
                setShowResultModal(false)
                setResult(null)
            }
        } catch (err) {
            console.error('Error deleting document:', err)
            alert('An error occurred while deleting the document. Please try again.')
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getToolColor = (toolId) => {
        const tool = tools.find(t => t.id === toolId)
        return tool?.color || 'blue'
    }

    // Document history helper functions
    const getFilteredAndSortedDocuments = () => {
        let filtered = [...documents]

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(doc =>
                doc.projectName.toLowerCase().includes(query) ||
                doc.toolName.toLowerCase().includes(query)
            )
        }

        // Apply type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(doc => doc.toolId === filterType)
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0
            switch (sortConfig.key) {
                case 'name':
                    comparison = a.projectName.localeCompare(b.projectName)
                    break
                case 'type':
                    comparison = a.toolName.localeCompare(b.toolName)
                    break
                case 'date':
                default:
                    comparison = new Date(a.createdAt) - new Date(b.createdAt)
                    break
            }
            return sortConfig.direction === 'asc' ? comparison : -comparison
        })

        return filtered
    }

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const toggleDropdown = (docId) => {
        setActiveDropdown(prev => prev === docId ? null : docId)
    }

    const handleShare = async (doc) => {
        const shareText = `Check out my ${doc.toolName}: ${doc.projectName}`
        try {
            await navigator.clipboard.writeText(shareText)
            alert('Link copied to clipboard!')
        } catch {
            alert('Failed to copy link')
        }
        setActiveDropdown(null)
    }

    const handleDownloadFromDropdown = (doc) => {
        const content = doc.content || ''
        const fileName = `${doc.projectName.replace(/[^a-z0-9]/gi, '_')}_${doc.toolId || 'document'}.md`
        const blob = new Blob([content], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setActiveDropdown(null)
    }

    // Close dropdown when clicking outside
    const handleClickOutside = () => {
        if (activeDropdown) {
            setActiveDropdown(null)
        }
    }

    const loadDocuments = async (userId) => {
        if (!userId) return

        try {
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error loading documents:', error)
                return
            }

            if (data) {
                const formattedDocs = data.map(doc => ({
                    id: doc.id,
                    projectName: doc.project_name,
                    toolName: doc.tool_name,
                    toolId: doc.tool_id,
                    content: doc.content,
                    createdAt: doc.created_at,
                    dbId: doc.id
                }))
                setDocuments(formattedDocs)
            }
        } catch (err) {
            console.error('Error loading documents:', err)
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate('/')
        setShowSettingsSidebar(false)
    }

    // Delete account with 5 second confirmation
    const handleStartDeleteAccount = () => {
        setDeleteConfirmActive(true)
        setDeleteCountdown(5)

        const interval = setInterval(() => {
            setDeleteCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const handleCancelDelete = () => {
        setDeleteConfirmActive(false)
        setDeleteCountdown(5)
    }

    const handleConfirmDeleteAccount = async () => {
        if (deleteCountdown > 0) return

        try {
            // Delete user documents first
            if (user) {
                await supabase.from('documents').delete().eq('user_id', user.id)
                await supabase.from('user_credits').delete().eq('user_id', user.id)
            }

            // Sign out (full account deletion would require admin API in production)
            await supabase.auth.signOut()
            alert('Your account data has been deleted. You have been signed out.')
            navigate('/')
        } catch (err) {
            console.error('Error deleting account:', err)
            alert('Error deleting account. Please contact support.')
        }
        setDeleteConfirmActive(false)
    }

    return (
        <div className="app dashboard-layout">
            {/* Left Sidebar Navigation */}
            <aside className="dashboard-sidebar">
                {/* Brand/Logo Section */}
                <div className="sidebar-brand">
                    <div className="sidebar-logo-icon">
                        <svg width="40" height="30" viewBox="0 0 500 375" xmlns="http://www.w3.org/2000/svg">
                            <g transform="translate(250, 187.5)">
                                <g transform="rotate(-22)">
                                    <ellipse cx="0" cy="0" rx="110" ry="24" fill="none" stroke="#FFFFFF" strokeWidth="10" />
                                </g>
                                <circle cx="0" cy="0" r="70" fill="#FFFFFF" />
                                <g transform="rotate(-22)">
                                    <path d="M -110 0 A 110 24 0 0 1 110 0" fill="none" stroke="#000000" strokeWidth="22" strokeLinecap="butt" />
                                    <path d="M -110 0 A 110 24 0 0 1 110 0" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="butt" />
                                </g>
                                <circle cx="85" cy="-75" r="14" fill="#FFFFFF" />
                            </g>
                        </svg>
                    </div>
                    <span className="sidebar-brand-text">Xiron</span>
                </div>

                {/* Navigation Links */}
                <nav className="sidebar-nav">
                    <button className={`sidebar-nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Create Dashboard</span>
                    </button>
                    <button className={`sidebar-nav-item ${activeView === 'templates' ? 'active' : ''}`} onClick={() => setActiveView('templates')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Template</span>
                    </button>
                    <button className={`sidebar-nav-item ${activeView === 'documents' ? 'active' : ''}`} onClick={() => setActiveView('documents')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13 2V9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Documents</span>
                        {documents.length > 0 && <span className="sidebar-badge">{documents.length}</span>}
                    </button>
                </nav>

                {/* User Profile Section - Bottom */}
                <div className="sidebar-user-section">
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-avatar">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="sidebar-user-details">
                            <span className="sidebar-user-name">
                                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                            </span>
                            <span className="sidebar-user-email">{user?.email || 'user@example.com'}</span>
                        </div>
                    </div>
                    <button
                        className="sidebar-settings-btn"
                        onClick={() => setShowSettingsSidebar(!showSettingsSidebar)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Settings</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="dashboard-main">
                <div className="dashboard-container">
                    {activeView !== 'documents' && (
                        <div className="dashboard-header">
                            <div className="dashboard-header-content">
                                <div>
                                    <h1 className="dashboard-title">Xiron Tools</h1>
                                    <p className="dashboard-subtitle">
                                        Create system architectures, user flows, database schemas, and PRDs with AI
                                    </p>
                                </div>
                                <div className="dashboard-user-section">
                                    <span className={`dashboard-plan-badge plan-badge-${userPlan}`}>
                                        {PLAN_FEATURES[userPlan]?.name || 'Free'}
                                    </span>
                                    <button className="dashboard-credits-button">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            <path d="M9 5V9L11.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <span>{userCredits} Credits</span>
                                    </button>

                                    <button
                                        className="dashboard-buy-credits-button"
                                        onClick={() => navigate('/pricing')}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 3.75V14.25M3.75 9H14.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span>Buy Credits</span>
                                    </button>

                                    <button
                                        className="dashboard-settings-button"
                                        onClick={() => setShowSettingsSidebar(!showSettingsSidebar)}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Sidebar Overlay */}
                    {showSettingsSidebar && (
                        <div
                            className="settings-sidebar-overlay"
                            onClick={() => setShowSettingsSidebar(false)}
                        />
                    )}

                    {/* Settings Sidebar */}
                    <div className={`settings-sidebar ${showSettingsSidebar ? 'open' : ''}`}>
                        <div className="settings-sidebar-header">
                            <h2 className="settings-sidebar-title">Settings</h2>
                            <button
                                className="settings-sidebar-close"
                                onClick={() => setShowSettingsSidebar(false)}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="settings-sidebar-content">
                            {/* Account Profile Section */}
                            <div className="settings-section">
                                <div className="settings-section-label">Account Profile</div>
                                <div className="settings-user-info">
                                    <div className="settings-user-avatar">
                                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="settings-user-details">
                                        <div className="settings-user-name">
                                            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                                        </div>
                                        <div className="settings-user-email">{user?.email}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Subscription & Billing Section */}
                            <div className="settings-section">
                                <div className="settings-section-label">Subscription & Billing</div>
                                <div className="settings-plan-card">
                                    <div className="settings-plan-header">
                                        <span className={`settings-plan-name plan-badge-${userPlan}`}>
                                            {PLAN_FEATURES[userPlan]?.name || 'Free'} Plan
                                        </span>
                                        <span className="settings-plan-status">Active</span>
                                    </div>
                                    <div className="settings-plan-details">
                                        <div className="settings-plan-row">
                                            <span>Monthly Credits</span>
                                            <span>{PLAN_FEATURES[userPlan]?.monthlyCredits || 50}</span>
                                        </div>
                                        {userPlan !== 'free' && (
                                            <div className="settings-plan-row">
                                                <span>Free Updates</span>
                                                <span>{freeUpdatesRemaining} remaining</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="settings-plan-actions">
                                    {userPlan === 'free' ? (
                                        <button
                                            className="settings-upgrade-button"
                                            onClick={() => {
                                                setShowSettingsSidebar(false)
                                                navigate('/pricing')
                                            }}
                                        >
                                            Upgrade Plan
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="settings-plan-action-btn"
                                                onClick={() => {
                                                    setShowSettingsSidebar(false)
                                                    navigate('/pricing')
                                                }}
                                            >
                                                Change Plan
                                            </button>
                                            <button
                                                className="settings-plan-action-btn secondary"
                                                onClick={() => {
                                                    setShowSettingsSidebar(false)
                                                    navigate('/pricing')
                                                }}
                                            >
                                                Buy Credits
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Usage & Credits Section */}
                            <div className="settings-section">
                                <div className="settings-section-label">Usage & Credits</div>
                                <div className="settings-credits-display">
                                    <div className="settings-credits-main">
                                        <span className="settings-credits-value">{userCredits}</span>
                                        <span className="settings-credits-label">credits remaining</span>
                                    </div>
                                    <div className="settings-credits-bar">
                                        <div
                                            className="settings-credits-bar-fill"
                                            style={{ width: `${Math.min((userCredits / (PLAN_FEATURES[userPlan]?.monthlyCredits || 50)) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <div className="settings-credits-meta">
                                        <span>Monthly allowance: {PLAN_FEATURES[userPlan]?.monthlyCredits || 50}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Data & Privacy Section */}
                            <div className="settings-section">
                                <div className="settings-section-label">Data & Privacy</div>
                                <button
                                    className="settings-link-button"
                                    onClick={handleSignOut}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75M12 12.75L15.75 9M15.75 9L12 5.25M15.75 9H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Sign Out
                                </button>

                                {!deleteConfirmActive ? (
                                    <button
                                        className="settings-delete-button"
                                        onClick={handleStartDeleteAccount}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Delete Account
                                    </button>
                                ) : (
                                    <div className="settings-delete-confirm">
                                        <div className="settings-delete-warning">
                                            This will permanently delete all your data!
                                        </div>
                                        <div className="settings-delete-actions">
                                            <button
                                                className="settings-delete-cancel"
                                                onClick={handleCancelDelete}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className={`settings-delete-confirm-btn ${deleteCountdown === 0 ? 'active' : ''}`}
                                                onClick={handleConfirmDeleteAccount}
                                                disabled={deleteCountdown > 0}
                                            >
                                                {deleteCountdown > 0 ? `Hold ${deleteCountdown}s...` : 'Confirm Delete'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Support Section */}
                            <div className="settings-section">
                                <div className="settings-section-label">💬 Support</div>
                                <a href="mailto:xyron.company@gmail.com" className="settings-link-button">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Email Support
                                </a>
                                <button
                                    className="settings-link-button"
                                    onClick={() => {
                                        setShowSettingsSidebar(false)
                                        navigate('/contact')
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Contact Us
                                </button>
                                <div className="settings-policy-links">
                                    <a href="/terms" target="_blank" rel="noopener noreferrer">Terms</a>
                                    <span>•</span>
                                    <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
                                    <span>•</span>
                                    <a href="/refund" target="_blank" rel="noopener noreferrer">Refund</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conditional Content - Dashboard Tools or Documents */}
                    {activeView === 'dashboard' && (
                        <>
                            <div className="tools-grid">
                                {tools.map((tool) => (
                                    <div key={tool.id} className="tool-card">
                                        <div className={`tool-header tool-header-${tool.color}`}>
                                            <div className="tool-icon-wrapper">
                                                {tool.icon === 'architecture' && (
                                                    <svg className="tool-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="3" y="3" width="7" height="7" stroke="white" strokeWidth="2" fill="none" />
                                                        <rect x="14" y="3" width="7" height="7" stroke="white" strokeWidth="2" fill="none" />
                                                        <rect x="3" y="14" width="7" height="7" stroke="white" strokeWidth="2" fill="none" />
                                                        <rect x="14" y="14" width="7" height="7" stroke="white" strokeWidth="2" fill="none" />
                                                    </svg>
                                                )}
                                                {tool.icon === 'userflow' && (
                                                    <svg className="tool-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="6" cy="12" r="3" stroke="white" strokeWidth="2" fill="none" />
                                                        <circle cx="18" cy="12" r="3" stroke="white" strokeWidth="2" fill="none" />
                                                        <path d="M9 12H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                                {tool.icon === 'database' && (
                                                    <svg className="tool-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <ellipse cx="12" cy="5" rx="9" ry="3" stroke="white" strokeWidth="2" fill="none" />
                                                        <path d="M3 5V19" stroke="white" strokeWidth="2" />
                                                        <path d="M21 5V19" stroke="white" strokeWidth="2" />
                                                        <ellipse cx="12" cy="12" rx="9" ry="3" stroke="white" strokeWidth="2" fill="none" />
                                                        <ellipse cx="12" cy="19" rx="9" ry="3" stroke="white" strokeWidth="2" fill="none" />
                                                    </svg>
                                                )}
                                                {tool.icon === 'prd' && (
                                                    <svg className="tool-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" fill="none" />
                                                        <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                                        <path d="M8 13H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                                        <path d="M8 17H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="tool-count-wrapper">
                                                <div className="tool-count">
                                                    {documents.filter(doc => doc.toolId === tool.id).length}
                                                </div>
                                                <div className="tool-count-label">Documents</div>
                                            </div>
                                        </div>

                                        <div className="tool-content">
                                            <h3 className="tool-title">{tool.name}</h3>
                                            <p className="tool-description">{tool.description}</p>
                                            <a href="#" className="tool-more-link">
                                                More <span className="chevron">▼</span>
                                            </a>

                                            <div className="tool-credits">
                                                <svg className="credits-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                                    <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                <span className="credits-text">{getCreditCost(userPlan, 'SINGLE_REPORT')} credits</span>
                                            </div>

                                            <button
                                                className={`tool-create-button ${!tool.enabled ? 'disabled' : ''}`}
                                                onClick={() => handleCreateNew(tool.id)}
                                                disabled={!tool.enabled}
                                            >
                                                <svg className="plus-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                Create New
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Developer Bundle Section - Premium Design */}
                            <div className="developer-bundle-section">
                                <div className="bundle-header">
                                    <div className="bundle-header-content">
                                        <h2 className="bundle-title">Generate all documents together</h2>
                                        <p className="bundle-description">
                                            Get a complete documentation package with system architecture, user flows, database schemas, and PRD in one go.
                                        </p>
                                    </div>
                                    <div className="bundle-badge">Bundle Package</div>
                                </div>

                                <div className="bundle-content">
                                    <div className="bundle-tools-label">Includes all these tools:</div>
                                    <div className="bundle-tools-grid">
                                        <div className="bundle-tool-card bundle-tool-blue">
                                            <div className="bundle-tool-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                                </svg>
                                            </div>
                                            <div className="bundle-tool-info">
                                                <div className="bundle-tool-name">System Architecture</div>
                                                <div className="bundle-tool-count">{documents.filter(doc => doc.toolId === 'architecture').length} docs</div>
                                            </div>
                                        </div>

                                        <div className="bundle-tool-card bundle-tool-purple">
                                            <div className="bundle-tool-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <circle cx="18" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <div className="bundle-tool-info">
                                                <div className="bundle-tool-name">User Flow</div>
                                                <div className="bundle-tool-count">{documents.filter(doc => doc.toolId === 'userflow').length} docs</div>
                                            </div>
                                        </div>

                                        <div className="bundle-tool-card bundle-tool-green">
                                            <div className="bundle-tool-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <path d="M3 5V19" stroke="currentColor" strokeWidth="2" />
                                                    <path d="M21 5V19" stroke="currentColor" strokeWidth="2" />
                                                    <ellipse cx="12" cy="12" rx="9" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <ellipse cx="12" cy="19" rx="9" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                </svg>
                                            </div>
                                            <div className="bundle-tool-info">
                                                <div className="bundle-tool-name">Database Schema</div>
                                                <div className="bundle-tool-count">{documents.filter(doc => doc.toolId === 'database').length} docs</div>
                                            </div>
                                        </div>

                                        <div className="bundle-tool-card bundle-tool-orange">
                                            <div className="bundle-tool-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    <path d="M8 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <div className="bundle-tool-info">
                                                <div className="bundle-tool-name">PRD Generator</div>
                                                <div className="bundle-tool-count">{documents.filter(doc => doc.toolId === 'prd').length} docs</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bundle-footer">
                                        <div className="bundle-credits">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                                <path d="M9 5V9L11.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                            <span>{getCreditCost(userPlan, 'BUNDLE')} credits</span>
                                        </div>
                                        <button
                                            className={`bundle-generate-button ${userPlan === 'free' ? 'bundle-locked' : ''}`}
                                            onClick={() => {
                                                if (userPlan === 'free') {
                                                    setUpgradeFeature('bundle');
                                                    setShowUpgradeModal(true);
                                                } else {
                                                    setBundleStep(1);
                                                    setShowBundleModal(true);
                                                }
                                            }}
                                            disabled={bundleLoading}
                                        >
                                            {userPlan === 'free' ? (
                                                <>
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M13.5 8.25V5.25C13.5 3.59315 12.1569 2.25 10.5 2.25H7.5C5.84315 2.25 4.5 3.59315 4.5 5.25V8.25M3.75 15.75H14.25C14.6642 15.75 15 15.4142 15 15V9.75C15 9.33579 14.6642 9 14.25 9H3.75C3.33579 9 3 9.33579 3 9.75V15C3 15.4142 3.33579 15.75 3.75 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                    Upgrade to Access Bundle
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10 3.75V16.25M3.75 10H16.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    Generate Complete Bundle
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Templates View */}
                    {activeView === 'templates' && (
                        <div className="templates-page">
                            <div className="templates-grid">
                                {mockTemplates.map((template) => (
                                    <div key={template.id} className="template-card">
                                        <div className={`template-header-icon template-icon-${template.color}`}>
                                            {template.icon === 'architecture' && (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                                                    <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                                                    <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                                                    <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
                                                </svg>
                                            )}
                                            {template.icon === 'userflow' && (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <circle cx="6" cy="12" r="3" strokeWidth="2" />
                                                    <circle cx="18" cy="12" r="3" strokeWidth="2" />
                                                    <path d="M9 12H15" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            )}
                                            {template.icon === 'database' && (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth="2" />
                                                    <path d="M3 5V19" strokeWidth="2" />
                                                    <path d="M21 5V19" strokeWidth="2" />
                                                    <ellipse cx="12" cy="19" rx="9" ry="3" strokeWidth="2" />
                                                </svg>
                                            )}
                                            {template.icon === 'prd' && (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" strokeWidth="2" />
                                                    <path d="M14 2V8H20" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="template-star">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>

                                        <h3 className="template-title">{template.title}</h3>
                                        <p className="template-desc">{template.description}</p>

                                        <div className="template-meta">
                                            <span className="template-time">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                    <path d="M12 6V12L16 14" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                {template.time}
                                            </span>
                                            <span className="template-uses">{template.uses} uses</span>
                                        </div>

                                        <div className="template-tags">
                                            <span className="template-tag">{template.type}</span>
                                        </div>

                                        <button
                                            className="template-btn"
                                            onClick={() => {
                                                handleCreateNew(template.toolId);
                                                setDescription(`Using template: ${template.title}. ${template.description}`);
                                            }}
                                        >
                                            Use Template
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeView === 'documents' && (
                        /* Documents Page View */
                        <div className="documents-page" onClick={handleClickOutside}>
                            <div className="documents-page-header">
                                <h1>My Documents</h1>
                                <p className="documents-page-count">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
                            </div>

                            {/* Toolbar */}
                            <div className="documents-page-toolbar">
                                <div className="doc-search-wrapper">
                                    <svg className="doc-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                        <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <input
                                        type="text"
                                        className="doc-search-input"
                                        placeholder="Search documents..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>

                                <div className="doc-toolbar-right">
                                    <div className="doc-filter-wrapper">
                                        <select
                                            className="doc-filter-select"
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="all">All Types</option>
                                            <option value="architecture">System Architecture</option>
                                            <option value="database">Database Schema</option>
                                            <option value="userflow">User Flow</option>
                                            <option value="prd">PRD Generator</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Table */}
                            <div className="documents-table-wrapper">
                                {getFilteredAndSortedDocuments().length === 0 ? (
                                    <div className="doc-empty-state">
                                        <div className="doc-empty-illustration">
                                            <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="25" y="15" width="70" height="90" rx="8" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" />
                                                <rect x="35" y="35" width="50" height="6" rx="3" fill="#D1D5DB" />
                                                <rect x="35" y="50" width="40" height="6" rx="3" fill="#E5E7EB" />
                                                <rect x="35" y="65" width="45" height="6" rx="3" fill="#E5E7EB" />
                                                <circle cx="90" cy="90" r="20" fill="#3B82F6" />
                                                <path d="M90 82V98M82 90H98" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <h3 className="doc-empty-title">
                                            {searchQuery || filterType !== 'all' ? 'No matching documents' : 'No documents yet'}
                                        </h3>
                                        <p className="doc-empty-text">
                                            {searchQuery || filterType !== 'all'
                                                ? 'Try adjusting your search or filter criteria'
                                                : 'Create your first document using the tools on the Dashboard'}
                                        </p>
                                        <button className="doc-empty-cta" onClick={() => setShowDocumentsPanel(false)}>
                                            Go to Dashboard
                                        </button>
                                    </div>
                                ) : (
                                    <table className="documents-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Created</th>
                                                <th>Last Modified</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getFilteredAndSortedDocuments().map((doc) => (
                                                <tr key={doc.id} onClick={() => handleViewDocument(doc)}>
                                                    <td className="doc-name-cell">
                                                        <div className={`doc-icon doc-icon-${doc.toolId}`}>
                                                            {doc.toolId === 'architecture' && (
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                </svg>
                                                            )}
                                                            {doc.toolId === 'userflow' && (
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                    <circle cx="18" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                    <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                </svg>
                                                            )}
                                                            {doc.toolId === 'database' && (
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                    <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                    <path d="M3 5V19" stroke="currentColor" strokeWidth="2" />
                                                                    <path d="M21 5V19" stroke="currentColor" strokeWidth="2" />
                                                                    <ellipse cx="12" cy="19" rx="9" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                </svg>
                                                            )}
                                                            {doc.toolId === 'prd' && (
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className="doc-name-info">
                                                            <span className="doc-name">{doc.projectName}</span>

                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`doc-type-badge doc-type-badge-${doc.toolId}`}>
                                                            {doc.toolName.replace(' (Developer Bundle)', '')}
                                                        </span>
                                                    </td>
                                                    <td className="doc-date">{formatDate(doc.createdAt)}</td>
                                                    <td className="doc-date">{formatDate(doc.createdAt)}</td>
                                                    <td className="doc-actions">
                                                        <button
                                                            className="doc-action-btn"
                                                            onClick={(e) => { e.stopPropagation(); handleDownloadFromDropdown(doc); }}
                                                            title="Download"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="doc-action-btn"
                                                            onClick={(e) => e.stopPropagation()}
                                                            title="Share"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="doc-action-btn"
                                                            onClick={(e) => e.stopPropagation()}
                                                            title="More"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="12" cy="5" r="1" fill="currentColor" />
                                                                <circle cx="12" cy="12" r="1" fill="currentColor" />
                                                                <circle cx="12" cy="19" r="1" fill="currentColor" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <>
                    <div className="modal-overlay" onClick={handleCloseModal}></div>
                    <div className="modal">
                        <button className="modal-close" onClick={handleCloseModal}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        <h2 className="modal-title">Create {currentTool?.name || 'Document'}</h2>
                        <p className="modal-subtitle">
                            {currentTool?.id === 'prd' && 'Describe your product features, goals, and requirements.'}
                            {currentTool?.id === 'architecture' && 'Describe your system components, services, and infrastructure requirements.'}
                            {currentTool?.id === 'database' && 'Describe your data models, entities, and relationships.'}
                            {currentTool?.id === 'userflow' && 'Describe your user journeys, interactions, and navigation paths.'}
                        </p>

                        <div className="modal-form">
                            <div className="form-group">
                                <label htmlFor="project-name" className="form-label">Project Name</label>
                                <input
                                    id="project-name"
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., E-commerce Platform."
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    className="form-textarea"
                                    placeholder="Describe your idea, the problem you're solving, and how your solution addresses it..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="6"
                                />
                            </div>

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <div className="modal-actions">
                                <button className="cancel-button" onClick={handleCloseModal} disabled={isLoading}>
                                    Cancel
                                </button>
                                <button
                                    className="continue-button"
                                    onClick={handleContinue}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            Continue <span className="arrow">→</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )
            }

            {
                isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-content">
                            <div className="space-loader">
                                <div className="earth">
                                    <div className="earth-surface"></div>
                                </div>
                                <div className="moon-orbit">
                                    <div className="moon"></div>
                                </div>
                            </div>
                            <p className="space-loading-text">Generating your {currentTool?.name || 'document'}...</p>
                            <p className="loading-subtext">This may take a few moments</p>
                        </div>
                    </div>
                )
            }

            {
                showQuestionsModal && (
                    <>
                        <div className="modal-overlay" onClick={handleCloseModal}></div>
                        <div className="modal">
                            <button className="modal-close" onClick={handleCloseModal}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>

                            <h2 className="modal-title">Additional Information</h2>
                            <p className="modal-subtitle">Please answer these questions to help us generate better documentation.</p>

                            <div className="modal-form">
                                {currentTool && (() => {
                                    const questions = getQuestionsForTool(currentTool.id)
                                    const showExtraQuestions = (userPlan === 'starter' || userPlan === 'pro') && (currentTool.id === 'architecture' || currentTool.id === 'userflow' || currentTool.id === 'database' || currentTool.id === 'prd')
                                    return (
                                        <>
                                            <div className="form-group">
                                                <label htmlFor="question1" className="form-label">
                                                    Question 1: {questions.q1}
                                                </label>
                                                <textarea
                                                    id="question1"
                                                    className="form-textarea"
                                                    placeholder={questions.q1Placeholder}
                                                    value={question1}
                                                    onChange={(e) => setQuestion1(e.target.value)}
                                                    rows="3"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="question2" className="form-label">
                                                    Question 2: {questions.q2}
                                                </label>
                                                <textarea
                                                    id="question2"
                                                    className="form-textarea"
                                                    placeholder={questions.q2Placeholder}
                                                    value={question2}
                                                    onChange={(e) => setQuestion2(e.target.value)}
                                                    rows="3"
                                                />
                                            </div>

                                            {/* Extra questions for Starter/Pro architecture */}
                                            {showExtraQuestions && questions.q3 && (
                                                <>
                                                    <div className="form-group">
                                                        <label htmlFor="question3" className="form-label">
                                                            Question 3: {questions.q3}
                                                        </label>
                                                        <textarea
                                                            id="question3"
                                                            className="form-textarea"
                                                            placeholder={questions.q3Placeholder}
                                                            value={question3}
                                                            onChange={(e) => setQuestion3(e.target.value)}
                                                            rows="3"
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="question4" className="form-label">
                                                            Question 4: {questions.q4}
                                                        </label>
                                                        <textarea
                                                            id="question4"
                                                            className="form-textarea"
                                                            placeholder={questions.q4Placeholder}
                                                            value={question4}
                                                            onChange={(e) => setQuestion4(e.target.value)}
                                                            rows="3"
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="question5" className="form-label">
                                                            Question 5: {questions.q5}
                                                        </label>
                                                        <textarea
                                                            id="question5"
                                                            className="form-textarea"
                                                            placeholder={questions.q5Placeholder}
                                                            value={question5}
                                                            onChange={(e) => setQuestion5(e.target.value)}
                                                            rows="3"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* Pro-only extra questions (7 total) */}
                                            {userPlan === 'pro' && questions.q6 && (
                                                <>
                                                    <div className="pro-questions-header">
                                                        <span className="pro-badge">👑 Pro</span>
                                                        <span>Additional Pro Questions for Deeper Analysis</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="question6" className="form-label">
                                                            Question 6: {questions.q6}
                                                        </label>
                                                        <textarea
                                                            id="question6"
                                                            className="form-textarea"
                                                            placeholder={questions.q6Placeholder}
                                                            value={question6}
                                                            onChange={(e) => setQuestion6(e.target.value)}
                                                            rows="3"
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="question7" className="form-label">
                                                            Question 7: {questions.q7}
                                                        </label>
                                                        <textarea
                                                            id="question7"
                                                            className="form-textarea"
                                                            placeholder={questions.q7Placeholder}
                                                            value={question7}
                                                            onChange={(e) => setQuestion7(e.target.value)}
                                                            rows="3"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )
                                })()}

                                {error && (
                                    <div className="error-message">
                                        {error}
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button className="cancel-button" onClick={handleCloseModal} disabled={isLoading}>
                                        Cancel
                                    </button>
                                    <button
                                        className="continue-button"
                                        onClick={handleSubmitQuestions}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="loading-spinner"></span>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                Generate {currentTool?.name || 'Document'} <span className="arrow">→</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

            {
                showResultModal && result && (
                    <>
                        <div className="modal-overlay" onClick={handleCloseResultModal}></div>
                        <div className="result-modal">
                            <button className="modal-close" onClick={handleCloseResultModal}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>

                            <h2 className="modal-title">Generated {result.toolName}: {result.projectName}</h2>

                            <div className={`prd-content ${userPlan === 'free' ? 'no-select' : ''}`}>
                                <pre className="prd-text">{result.content}</pre>
                            </div>

                            <div className="modal-actions">
                                {PLAN_FEATURES[userPlan]?.canDownload ? (
                                    <button className="download-button" onClick={handleDownloadReport}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25M5.25 7.5L9 11.25M9 11.25L12.75 7.5M9 11.25V2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Download
                                    </button>
                                ) : (
                                    <button className="download-button download-button-locked" onClick={() => { setUpgradeFeature('download'); setShowUpgradeModal(true); }}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.5 8.25V5.25C13.5 3.59315 12.1569 2.25 10.5 2.25H7.5C5.84315 2.25 4.5 3.59315 4.5 5.25V8.25M3.75 15.75H14.25C14.6642 15.75 15 15.4142 15 15V9.75C15 9.33579 14.6642 9 14.25 9H3.75C3.33579 9 3 9.33579 3 9.75V15C3 15.4142 3.33579 15.75 3.75 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        Upgrade to Download
                                    </button>
                                )}
                                {PLAN_FEATURES[userPlan]?.canUpdate ? (
                                    <button className="update-button" onClick={() => setShowUpdateModal(true)}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.75 2.25L15.75 5.25M1.5 16.5L4.35 16.0575C4.59083 16.0217 4.71125 16.0038 4.82425 15.9677C4.92485 15.9358 5.02141 15.8934 5.11261 15.8413C5.21513 15.7827 5.30755 15.7071 5.4924 15.5559L16.125 4.92375C16.9534 4.09534 16.9534 2.75841 16.125 1.93C15.2966 1.10159 13.9597 1.10159 13.1313 1.93L2.49375 12.5625C2.3426 12.7474 2.26702 12.8398 2.20845 12.9423C2.15644 13.0335 2.11405 13.1301 2.08215 13.2307C2.04605 13.3437 2.02815 13.4641 1.99235 13.705L1.5 16.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Update
                                    </button>
                                ) : (
                                    <button className="update-button update-button-locked" onClick={() => { setUpgradeFeature('update'); setShowUpgradeModal(true); }}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.5 8.25V5.25C13.5 3.59315 12.1569 2.25 10.5 2.25H7.5C5.84315 2.25 4.5 3.59315 4.5 5.25V8.25M3.75 15.75H14.25C14.6642 15.75 15 15.4142 15 15V9.75C15 9.33579 14.6642 9 14.25 9H3.75C3.33579 9 3 9.33579 3 9.75V15C3 15.4142 3.33579 15.75 3.75 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        Upgrade to Update
                                    </button>
                                )}
                                <button className="continue-button" onClick={handleCloseResultModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </>
                )
            }

            {/* Update Report Modal */}
            {
                showUpdateModal && result && (
                    <>
                        <div className="modal-overlay" onClick={() => { setShowUpdateModal(false); setNewFeatures(''); }}></div>
                        <div className="modal update-modal">
                            <button className="modal-close" onClick={() => { setShowUpdateModal(false); setNewFeatures(''); }}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>

                            <h2 className="modal-title">Update Report</h2>
                            <p className="modal-subtitle">
                                What new features do you want to add to "{result.projectName}"?
                            </p>

                            <div className="update-info-box">
                                <div className="update-info-item">
                                    <span className="update-info-label">Project:</span>
                                    <span className="update-info-value">{result.projectName}</span>
                                </div>
                                <div className="update-info-item">
                                    <span className="update-info-label">Type:</span>
                                    <span className="update-info-value">{result.toolName}</span>
                                </div>
                            </div>

                            <div className="modal-form">
                                <div className="form-group">
                                    <label htmlFor="new-features" className="form-label">New Features / Changes</label>
                                    <textarea
                                        id="new-features"
                                        className="form-textarea"
                                        placeholder="Describe the new features or changes you want to add to this report...

Examples:
- Add payment integration with Stripe
- Include user authentication flow
- Add analytics dashboard section
- Update the database schema for notifications"
                                        value={newFeatures}
                                        onChange={(e) => setNewFeatures(e.target.value)}
                                        rows="6"
                                    />
                                </div>

                                <div className="update-credits-info">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                        <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    {freeUpdatesRemaining > 0 ? (
                                        <span>This update is FREE! ({freeUpdatesRemaining} free update{freeUpdatesRemaining > 1 ? 's' : ''} remaining)</span>
                                    ) : (
                                        <span>This update will cost {UPDATE_CREDIT_COST} credits (You have {userCredits} credits)</span>
                                    )}
                                </div>

                                {error && (
                                    <div className="error-message">
                                        {error}
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button
                                        className="cancel-button"
                                        onClick={() => { setShowUpdateModal(false); setNewFeatures(''); setError(null); }}
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="continue-button"
                                        onClick={handleUpdateReport}
                                        disabled={isUpdating || !newFeatures.trim()}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <span className="loading-spinner"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>Update Report <span className="arrow">→</span></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

            {/* Upgrade Modal */}
            {
                showUpgradeModal && (
                    <>
                        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}></div>
                        <div className="modal upgrade-modal">
                            <button className="modal-close" onClick={() => setShowUpgradeModal(false)}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>

                            <div className="upgrade-modal-icon"></div>
                            <h2 className="modal-title">Upgrade Required</h2>
                            <p className="modal-subtitle">
                                {upgradeFeature === 'download' && 'Download reports is available on Starter and Pro plans.'}
                                {upgradeFeature === 'update' && 'Update reports is available on Starter and Pro plans.'}
                                {upgradeFeature === 'bundle' && 'Developer Bundle is available on Pro plan only.'}
                            </p>

                            <div className="upgrade-plan-comparison">
                                <div className="upgrade-plan-card">
                                    <h4>Starter - ₹99</h4>
                                    <ul>
                                        <li>• 120 credits/month</li>
                                        <li>• Download reports</li>
                                        <li>• Update reports (1 free)</li>
                                        <li>• Developer Bundle</li>
                                    </ul>
                                </div>
                                <div className="upgrade-plan-card upgrade-plan-recommended">
                                    <span className="recommended-badge">Recommended</span>
                                    <h4>Pro - ₹199</h4>
                                    <ul>
                                        <li>• 240 credits/month</li>
                                        <li>• Download reports</li>
                                        <li>• Update reports (3 free)</li>
                                        <li>• Developer Bundle</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="cancel-button" onClick={() => setShowUpgradeModal(false)}>
                                    Maybe Later
                                </button>
                                <button className="continue-button" onClick={() => { setShowUpgradeModal(false); navigate('/pricing'); }}>
                                    View Plans →
                                </button>
                            </div>
                        </div>
                    </>
                )
            }
            {/* Bundle Modal */}
            {
                showBundleModal && (
                    <>
                        <div className="modal-overlay" onClick={() => setShowBundleModal(false)}></div>
                        <div className="modal">
                            <button className="modal-close" onClick={() => setShowBundleModal(false)}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>

                            <h2 className="modal-title">Developer Bundle {bundleStep === 1 ? '(Step 1/2)' : '(Step 2/2)'}</h2>
                            <p className="modal-subtitle">
                                {bundleStep === 1
                                    ? 'First, tell us about your project idea in detail.'
                                    : 'Now answer these questions to generate comprehensive documentation.'}
                            </p>

                            <div className="modal-form" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
                                {/* Step 1: Project Name and Description */}
                                {bundleStep === 1 && (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="bundle-project-name" className="form-label">Project Name</label>
                                            <input
                                                id="bundle-project-name"
                                                type="text"
                                                className="form-input"
                                                placeholder="e.g., FoodDelivery App, InventoryPro, HealthTracker"
                                                value={projectName}
                                                onChange={(e) => setProjectName(e.target.value)}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="bundle-description" className="form-label">
                                                Project Description - Tell us everything about your idea
                                            </label>
                                            <textarea
                                                id="bundle-description"
                                                className="form-textarea"
                                                placeholder="Describe your complete idea here... What is it? What inspired you? What do you know about the market? Who will use it? What makes it different? Share all your thoughts and knowledge about this project..."
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                rows="8"
                                            />
                                        </div>

                                        {error && (
                                            <div className="error-message">
                                                {error}
                                            </div>
                                        )}

                                        <div className="modal-actions">
                                            <button className="cancel-button" onClick={() => { setShowBundleModal(false); setBundleStep(1); setError(null); }}>
                                                Cancel
                                            </button>
                                            <button
                                                className="continue-button"
                                                onClick={() => {
                                                    if (!projectName.trim() || !description.trim()) {
                                                        setError('Please fill in both project name and description');
                                                        return;
                                                    }
                                                    setError(null);
                                                    setBundleStep(2);
                                                }}
                                            >
                                                Continue to Questions →
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Step 2: 7 Questions */}
                                {bundleStep === 2 && (
                                    <>

                                        <div className="form-group">
                                            <label htmlFor="bundle-q1" className="form-label">
                                                1. What problem are you solving, and who has this problem?
                                            </label>
                                            <textarea
                                                id="bundle-q1"
                                                className="form-textarea"
                                                placeholder="e.g., Small restaurant owners struggle to manage online orders efficiently. They lose customers due to slow order processing and lack of delivery tracking..."
                                                value={question1}
                                                onChange={(e) => setQuestion1(e.target.value)}
                                                rows="3"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="bundle-q2" className="form-label">
                                                2. Walk me through how someone would use this from start to finish
                                            </label>
                                            <textarea
                                                id="bundle-q2"
                                                className="form-textarea"
                                                placeholder="e.g., Customer opens app → browses menu → adds items to cart → enters delivery address → pays online → tracks order in real-time → receives food..."
                                                value={question2}
                                                onChange={(e) => setQuestion2(e.target.value)}
                                                rows="3"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="bundle-q3" className="form-label">
                                                3. What information do you need to collect, store, and show to users?
                                            </label>
                                            <textarea
                                                id="bundle-q3"
                                                className="form-textarea"
                                                placeholder="e.g., User profiles (name, phone, addresses), menu items (name, price, images), orders (items, total, status), delivery partner info..."
                                                value={question3}
                                                onChange={(e) => setQuestion3(e.target.value)}
                                                rows="3"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="bundle-q4" className="form-label">
                                                4. How many people will use this daily, and where (computer, phone, tablet)?
                                            </label>
                                            <textarea
                                                id="bundle-q4"
                                                className="form-textarea"
                                                placeholder="e.g., Initially 500 users/day, scaling to 10,000. Customers use mobile app, restaurant owners use tablet/web dashboard, admins use web..."
                                                value={question4}
                                                onChange={(e) => setQuestion4(e.target.value)}
                                                rows="3"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="bundle-q5" className="form-label">
                                                5. What must work on Day 1, and what can wait for later versions?
                                            </label>
                                            <textarea
                                                id="bundle-q5"
                                                className="form-textarea"
                                                placeholder="e.g., Day 1: User signup, menu browsing, ordering, basic payments. Later: Reviews, loyalty points, AI recommendations, multi-restaurant support..."
                                                value={question5}
                                                onChange={(e) => setQuestion5(e.target.value)}
                                                rows="3"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="bundle-q6" className="form-label">
                                                6. Do you need to connect with other tools or services?
                                            </label>
                                            <textarea
                                                id="bundle-q6"
                                                className="form-textarea"
                                                placeholder="e.g., Razorpay/Stripe for payments, Google Maps for delivery tracking, Twilio for SMS, Firebase for notifications, AWS S3 for images..."
                                                value={question6}
                                                onChange={(e) => setQuestion6(e.target.value)}
                                                rows="3"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="bundle-q7" className="form-label">
                                                7. How will you know this project is successful?
                                            </label>
                                            <textarea
                                                id="bundle-q7"
                                                className="form-textarea"
                                                placeholder="e.g., 1000 orders/month, 4.5+ app rating, 30% repeat customers, restaurant owners save 2 hours daily, positive user reviews..."
                                                value={question7}
                                                onChange={(e) => setQuestion7(e.target.value)}
                                                rows="3"
                                            />
                                        </div>

                                        {/* Pro-only extra questions (10 total for Pro) */}
                                        {userPlan === 'pro' && (
                                            <>
                                                <div className="pro-questions-header">
                                                    <span className="pro-badge">👑 Pro</span>
                                                    <span>Extra Questions for Comprehensive Analysis</span>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="bundle-q8" className="form-label">
                                                        8. What are the top 3 non‑negotiable outcomes this system must guarantee?
                                                    </label>
                                                    <textarea
                                                        id="bundle-q8"
                                                        className="form-textarea"
                                                        placeholder="e.g., Low latency for AI responses, strict cost control, 99.9% uptime, easy onboarding for non-tech users, strong data privacy, etc."
                                                        value={question8}
                                                        onChange={(e) => setQuestion8(e.target.value)}
                                                        rows="3"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="bundle-q9" className="form-label">
                                                        9. What real‑world scale should this architecture be designed for in the next 12–18 months?
                                                    </label>
                                                    <textarea
                                                        id="bundle-q9"
                                                        className="form-textarea"
                                                        placeholder="e.g., Monthly active users, peak concurrent users, average reports/jobs per day, target regions, and acceptable monthly infra budget."
                                                        value={question9}
                                                        onChange={(e) => setQuestion9(e.target.value)}
                                                        rows="3"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="bundle-q10" className="form-label">
                                                        10. Write a detailed description of the user scenario
                                                    </label>
                                                    <textarea
                                                        id="bundle-q10"
                                                        className="form-textarea"
                                                        placeholder="e.g., Suriya, a student, needs to buy a book from the library. He opens the app, searches for the book, adds it to cart, and checks out..."
                                                        value={question10}
                                                        onChange={(e) => setQuestion10(e.target.value)}
                                                        rows="3"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {error && (
                                            <div className="error-message">
                                                {error}
                                            </div>
                                        )}

                                        <div className="modal-actions">
                                            <button className="cancel-button" onClick={() => { setBundleStep(1); }}>
                                                ← Back
                                            </button>
                                            <button className="continue-button" onClick={handleGenerateBundle}>
                                                Generate Bundle ({getCreditCost(userPlan, 'BUNDLE')} credits) →
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )
            }

            {/* Bundle Loading Overlay */}
            {
                bundleLoading && (
                    <div className="loading-overlay">
                        <div className="loading-content">
                            <div className="loading-spinner-large"></div>
                            <p>Generating Developer Bundle...</p>
                            <p className="loading-subtext">Creating PRD, Architecture, Database Schema, and User Flow</p>
                            <p className="loading-subtext" style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>This may take 30-60 seconds</p>
                        </div>
                    </div>
                )
            }
        </div >


    )

}

export default Dashboard
