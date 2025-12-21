import React from 'react'
import UseCasePage from '../../components/UseCasePage'

function StudentBlueprint() {
    const pageData = {
        slug: 'blueprint-generator-for-students',
        title: 'Blueprint Generator for Students',
        metaTitle: 'Blueprint Generator for Programming Students | Learn Software Architecture | Xiron',
        metaDescription: 'Perfect for computer science students learning software architecture. Generate professional technical documentation and understand best practices with AI assistance.',
        heroDescription: 'Learn software architecture fundamentals while building real projects. Xiron helps students understand how professional developers plan and document their applications.',
        keywords: ['student developer', 'learn software architecture', 'programming students', 'CS student tools', 'software engineering education', 'technical documentation learning'],
        sections: [
            {
                icon: 'problem',
                title: 'The Challenge for Student Developers',
                content: [
                    'As a student, you know how to code but often struggle with the bigger picture. How do you structure a real application? What database design patterns should you use? How do professional developers plan their projects?',
                    'Most courses focus on syntax and algorithms, but real-world development requires understanding system architecture, database design, and proper documentation - skills that take years to develop.'
                ]
            },
            {
                icon: 'solution',
                title: 'Learn by Seeing Real Examples',
                content: [
                    'Xiron generates professional-grade technical documentation for your project ideas. Study the generated architecture to understand why certain decisions are made, how components interact, and what makes a scalable application.'
                ],
                list: [
                    'See how professionals structure microservices architectures',
                    'Understand database normalization with real examples',
                    'Learn API design best practices hands-on',
                    'Study user flow documentation patterns',
                    'Build portfolio projects with proper documentation'
                ]
            },
            {
                icon: 'benefits',
                title: 'Benefits for Students',
                list: [
                    'Accelerate your learning with AI-generated examples',
                    'Build impressive portfolio projects with professional docs',
                    'Understand industry-standard patterns and practices',
                    'Perfect for capstone projects and thesis work',
                    'Free tier available for hobby projects',
                    'Learn at your own pace with comprehensive documentation'
                ]
            },
            {
                icon: 'howto',
                title: 'Perfect for Your Next Class Project',
                content: [
                    'Whether you\'re working on a capstone project, thesis, or just learning on your own, Xiron helps you understand how to properly plan a software project. Generated blueprints include explanations of why certain architectural decisions are made.',
                    'Use the blueprints as learning material, or submit them alongside your code to show professors you understand the full software development lifecycle.'
                ]
            }
        ]
    }

    return <UseCasePage {...pageData} />
}

export default StudentBlueprint
