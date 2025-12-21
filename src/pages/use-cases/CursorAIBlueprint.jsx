import React from 'react'
import UseCasePage from '../../components/UseCasePage'

function CursorAIBlueprint() {
    const pageData = {
        slug: 'cursor-ai-blueprint-generator',
        title: 'Cursor AI Blueprint Generator',
        metaTitle: 'Cursor AI Blueprint Generator - Create Perfect Prompts for Cursor | Xiron',
        metaDescription: 'Generate comprehensive technical blueprints optimized for Cursor AI. Get better code output, reduce iterations, and save up to 80% on AI coding credits.',
        heroDescription: 'Create detailed technical blueprints that Cursor AI understands perfectly. Stop wasting credits on vague prompts and start getting production-ready code on the first try.',
        keywords: ['Cursor AI', 'blueprint generator', 'AI coding prompts', 'Cursor prompts', 'AI code generation', 'technical documentation'],
        sections: [
            {
                icon: 'problem',
                title: 'The Problem with Vague Prompts',
                content: [
                    'When you give Cursor AI a vague prompt like "build me an e-commerce site," you\'re setting yourself up for multiple iterations, debugging sessions, and wasted credits. The AI doesn\'t have the context it needs to make good architectural decisions.',
                    'Without clear specifications, Cursor generates code that might work but doesn\'t follow best practices, lacks proper error handling, or uses outdated patterns. You end up spending more time fixing AI-generated code than you would have spent writing it yourself.'
                ]
            },
            {
                icon: 'solution',
                title: 'The Xiron Solution for Cursor Users',
                content: [
                    'Xiron generates comprehensive technical blueprints that give Cursor AI the context it needs. Our blueprints include system architecture, database schemas, API specifications, and user flow documentation - everything Cursor needs to generate production-quality code.'
                ],
                list: [
                    'Detailed system architecture with component relationships',
                    'Complete database schema with indexes and relationships',
                    'API endpoint specifications with request/response formats',
                    'User authentication and authorization flows',
                    'Error handling and edge case documentation'
                ]
            },
            {
                icon: 'benefits',
                title: 'Benefits for Cursor AI Users',
                list: [
                    'Save 80% on AI coding credits with precise prompts',
                    'Get production-ready code on the first generation',
                    'Reduce debugging time by up to 70%',
                    'Consistent coding patterns across your codebase',
                    'Better architectural decisions from day one',
                    'Faster time-to-MVP with proper planning'
                ]
            },
            {
                icon: 'howto',
                title: 'How to Use Xiron with Cursor AI',
                content: [
                    'Simply describe your project idea in plain language, answer a few questions about your requirements, and Xiron generates a complete technical blueprint. Copy this blueprint into your Cursor AI context, and watch as it generates exactly the code you need.',
                    'The blueprint acts as a detailed specification that Cursor can reference throughout your coding session, ensuring consistency and quality across all generated code.'
                ]
            }
        ]
    }

    return <UseCasePage {...pageData} />
}

export default CursorAIBlueprint
