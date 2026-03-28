"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RotateCcw, Trophy, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    id: 1,
    difficulty: "Easy",
    category: "Marketing Fundamentals",
    question: "What is marketing according to the notes?",
    options: [
      "A short-term method for increasing sales through discounts",
      "The process by which companies create value for customers and build strong relationships to capture value in return",
      "A way to reduce production costs by focusing on efficiency",
      "A system for managing only promotion and advertising"
    ],
    correctIndex: 1,
    explanation:
      "The notes define marketing as creating value for customers and building strong customer relationships in order to capture value from customers in return."
  },
  {
    id: 2,
    difficulty: "Easy",
    category: "Marketing Fundamentals",
    question: "How many steps are in the marketing process?",
    options: ["Three", "Four", "Five", "Six"],
    correctIndex: 2,
    explanation:
      "The marketing process has five steps. The first four focus on creating customer value, and the fifth focuses on capturing value for the firm."
  },
  {
    id: 3,
    difficulty: "Easy",
    category: "Marketing Fundamentals",
    question: "Which of the following is the first step in the marketing process?",
    options: [
      "Capture value from customers in return",
      "Understand the marketplace and customer needs and wants",
      "Construct an integrated marketing platform",
      "Engage customers and create delight"
    ],
    correctIndex: 1,
    explanation:
      "The process begins with understanding the marketplace and customer needs and wants."
  },
  {
    id: 4,
    difficulty: "Easy",
    category: "Marketing Fundamentals",
    question: "When wants are backed by buying power, they become:",
    options: ["Needs", "Demands", "Markets", "Offers"],
    correctIndex: 1,
    explanation:
      "Wants become demands when consumers have the buying power to act on them."
  },
  {
    id: 5,
    difficulty: "Easy",
    category: "Marketing Fundamentals",
    question: "Marketing myopia means that a company:",
    options: [
      "Focuses too much on the product and too little on customer needs",
      "Focuses too much on customer needs and too little on promotion",
      "Ignores efficiency and prices",
      "Only sells to business customers"
    ],
    correctIndex: 0,
    explanation:
      "Marketing myopia is when a company focuses too much on its product instead of the underlying customer need."
  },
  {
    id: 6,
    difficulty: "Easy",
    category: "Strategy",
    question: "What does market segmentation mean?",
    options: [
      "Lowering prices in all markets",
      "Dividing the total market into smaller groups of buyers with different needs or characteristics",
      "Combining all customers into one single mass market",
      "Creating only one product for everyone"
    ],
    correctIndex: 1,
    explanation:
      "Market segmentation means dividing the total market into smaller segments that the company can understand and serve better."
  },
  {
    id: 7,
    difficulty: "Easy",
    category: "Strategy",
    question: "Which question is central when designing a customer-driven marketing strategy?",
    options: [
      "Which factory should we close?",
      "What customers will we serve?",
      "How can we avoid all competitors?",
      "How can we stop collecting data?"
    ],
    correctIndex: 1,
    explanation:
      "A key question in customer-driven strategy is deciding what customers the company will serve."
  },
  {
    id: 8,
    difficulty: "Easy",
    category: "Strategy",
    question: "What is a value proposition?",
    options: [
      "A set of benefits a company promises to deliver to satisfy customer needs",
      "A legal agreement between firms",
      "A list of production goals",
      "A pricing spreadsheet"
    ],
    correctIndex: 0,
    explanation:
      "A value proposition is what a company promises to deliver to customers to satisfy their needs."
  },
  {
    id: 9,
    difficulty: "Easy",
    category: "Strategy",
    question: "Which of the following belongs to the traditional marketing mix?",
    options: ["Product", "People", "Process", "Physical evidence"],
    correctIndex: 0,
    explanation:
      "The four classic Ps are product, price, place, and promotion."
  },
  {
    id: 10,
    difficulty: "Easy",
    category: "CRM",
    question: "Customer relationship management is best described as:",
    options: [
      "The process of reducing all customer contact",
      "The overall process of building and maintaining profitable customer relationships",
      "A sales script for cold calling",
      "A loyalty app only"
    ],
    correctIndex: 1,
    explanation:
      "CRM is the overall process of building and maintaining profitable customer relationships."
  },
  {
    id: 11,
    difficulty: "Easy",
    category: "CRM",
    question: "Which of these is an example of creating bonds with consumers?",
    options: ["Loyalty programs", "Factory automation", "Discount warehouses", "Supplier audits"],
    correctIndex: 0,
    explanation:
      "The notes specifically mention loyalty programs as a way of creating bonds with consumers."
  },
  {
    id: 12,
    difficulty: "Easy",
    category: "Strategic Planning",
    question: "Which of these is one of the four steps of company-wide strategic planning?",
    options: [
      "Hiring influencers",
      "Defining the company’s mission",
      "Expanding into every segment immediately",
      "Reducing all prices"
    ],
    correctIndex: 1,
    explanation:
      "Strategic planning includes defining the mission, setting objectives and goals, designing the business portfolio, and planning functional strategies."
  },
  {
    id: 13,
    difficulty: "Easy",
    category: "Strategic Planning",
    question: "A mission statement should be:",
    options: [
      "Meaningless and broad",
      "Meaningful and specific yet motivating",
      "Focused only on short-term profit",
      "Written only for investors"
    ],
    correctIndex: 1,
    explanation:
      "The notes say mission statements should be meaningful and specific, yet still motivating."
  },
  {
    id: 14,
    difficulty: "Easy",
    category: "Environment",
    question: "Which of the following is part of the macroenvironment?",
    options: ["Suppliers", "Competitors", "Demographic forces", "Publics"],
    correctIndex: 2,
    explanation:
      "Demographic forces belong to the macroenvironment, while suppliers, competitors, and publics are in the microenvironment."
  },
  {
    id: 15,
    difficulty: "Easy",
    category: "Environment",
    question: "Which of these is part of the microenvironment?",
    options: ["Cultural forces", "Technological forces", "Marketing intermediaries", "Economic forces"],
    correctIndex: 2,
    explanation:
      "Marketing intermediaries are part of the microenvironment because they are actors close to the company."
  },
  {
    id: 16,
    difficulty: "Easy",
    category: "Consumer Behavior",
    question: "Consumer buyer behavior refers to the buying behavior of:",
    options: [
      "Only governments",
      "Only large corporations",
      "Final consumers and households buying for personal use",
      "Only online shoppers"
    ],
    correctIndex: 2,
    explanation:
      "Consumer buyer behavior is about individuals and households buying goods and services for personal consumption."
  },
  {
    id: 17,
    difficulty: "Easy",
    category: "Consumer Behavior",
    question: "Which stage comes first in the buyer decision process?",
    options: ["Purchase decision", "Evaluation of alternatives", "Need recognition", "Post-purchase behavior"],
    correctIndex: 2,
    explanation:
      "The buyer decision process starts with need recognition."
  },
  {
    id: 18,
    difficulty: "Easy",
    category: "Innovation Adoption",
    question: "Which sequence shows the product adoption process in the correct order?",
    options: [
      "Awareness, interest, evaluation, trial, adoption",
      "Interest, awareness, purchase, loyalty, advocacy",
      "Need recognition, trial, adoption, evaluation, awareness",
      "Awareness, purchase, satisfaction, adoption, retention"
    ],
    correctIndex: 0,
    explanation:
      "The adoption process moves from awareness to interest, evaluation, trial, and adoption."
  },
  {
    id: 19,
    difficulty: "Easy",
    category: "Business Markets",
    question: "What is the business market?",
    options: [
      "Only private consumers",
      "Organizations buying goods and services for further production, resale, or rental",
      "Only public agencies",
      "Only firms buying software"
    ],
    correctIndex: 1,
    explanation:
      "The business market consists of organizations that buy for production, resale, or rental, not for personal use."
  },
  {
    id: 20,
    difficulty: "Easy",
    category: "Business Markets",
    question: "Which of these is one of the three business buying situations?",
    options: ["Impulse buying", "Straight rebuy", "Emotional purchase", "Seasonal purchase"],
    correctIndex: 1,
    explanation:
      "The three business buying situations are straight rebuy, modified rebuy, and new task."
  },
  {
    id: 21,
    difficulty: "Medium",
    category: "Orientations",
    question: "Which marketing management orientation focuses on low cost and efficiency?",
    options: ["Production concept", "Product concept", "Selling concept", "Marketing concept"],
    correctIndex: 0,
    explanation:
      "The production concept assumes customers favor affordable and available products, so the firm focuses on efficiency and low prices."
  },
  {
    id: 22,
    difficulty: "Medium",
    category: "Orientations",
    question: "Which orientation assumes the company will win by having the best product?",
    options: ["Production concept", "Selling concept", "Product concept", "Societal marketing concept"],
    correctIndex: 2,
    explanation:
      "The product concept focuses on product quality, performance, and features."
  },
  {
    id: 23,
    difficulty: "Medium",
    category: "Orientations",
    question: "Which orientation says consumers will buy only if the firm undertakes a large-scale selling effort?",
    options: ["Marketing concept", "Societal marketing concept", "Selling concept", "Product concept"],
    correctIndex: 2,
    explanation:
      "The selling concept assumes aggressive selling and promotion are needed to move enough products."
  },
  {
    id: 24,
    difficulty: "Medium",
    category: "Orientations",
    question: "Which orientation starts with the customer and builds the product around customer needs?",
    options: ["Selling concept", "Marketing concept", "Production concept", "Product concept"],
    correctIndex: 1,
    explanation:
      "The marketing concept begins with customer needs and then develops the offering around those needs."
  },
  {
    id: 25,
    difficulty: "Medium",
    category: "Orientations",
    question: "The societal marketing concept balances profit, customer satisfaction, and:",
    options: ["Factory capacity", "Society or human welfare", "Short-term sales pressure", "Share buybacks"],
    correctIndex: 1,
    explanation:
      "The societal marketing concept balances company profits, customer wants, and society’s long-run interests."
  },
  {
    id: 26,
    difficulty: "Medium",
    category: "Strategy",
    question: "Targeting means that a company should:",
    options: [
      "Serve every segment equally",
      "Choose segments where it can generate the greatest customer value profitably and over time",
      "Always choose the largest segment",
      "Avoid narrow segments"
    ],
    correctIndex: 1,
    explanation:
      "Targeting is about choosing the segments the company can serve best and most profitably over time."
  },
  {
    id: 27,
    difficulty: "Medium",
    category: "Strategy",
    question: "Positioning means arranging for a product to occupy:",
    options: [
      "The cheapest place on every shelf",
      "A clear, distinctive, and desirable place in the minds of target consumers",
      "A hidden place away from competitors",
      "The broadest place in all markets"
    ],
    correctIndex: 1,
    explanation:
      "Positioning is about creating a clear and desirable place for the product in the minds of target consumers relative to competitors."
  },
  {
    id: 28,
    difficulty: "Medium",
    category: "Strategy",
    question: "In the 4 Ps, place refers to:",
    options: [
      "The emotional value of a product",
      "Activities that make the product available to target consumers",
      "The production process inside the factory",
      "The store’s visual design only"
    ],
    correctIndex: 1,
    explanation:
      "Place refers to distribution activities that make the offering available to target customers."
  },
  {
    id: 29,
    difficulty: "Medium",
    category: "Strategy",
    question: "In the 4 As, affordability is closest to which idea?",
    options: ["Whether people know the brand", "Whether the price is manageable for customers", "Whether the product is ethically made", "Whether the product is easy to explain"],
    correctIndex: 1,
    explanation:
      "Affordability is about whether customers can realistically pay for the offering."
  },
  {
    id: 30,
    difficulty: "Medium",
    category: "CRM",
    question: "Customer equity is:",
    options: [
      "The value of one purchase",
      "The total combined customer lifetime values of all the company’s customers",
      "The same as promotion spending",
      "A measure of warehouse efficiency"
    ],
    correctIndex: 1,
    explanation:
      "Customer equity is the combined lifetime value of all current and future customer relationships."
  },
  {
    id: 31,
    difficulty: "Medium",
    category: "Strategic Planning",
    question: "A market-oriented mission statement asks questions such as:",
    options: [
      "What is our software version?",
      "Who is our customer and what do consumers value?",
      "How do we minimize training budgets?",
      "Which competitor should we copy?"
    ],
    correctIndex: 1,
    explanation:
      "The notes say a market-oriented mission asks what business we are in, who the customer is, what consumers value, and what the business should be."
  },
  {
    id: 32,
    difficulty: "Medium",
    category: "Strategic Planning",
    question: "A business portfolio is:",
    options: [
      "Only the marketing budget",
      "The collection of businesses and products that make up the company",
      "A list of customers",
      "A set of sales reports"
    ],
    correctIndex: 1,
    explanation:
      "The business portfolio is the collection of businesses and products that make up the company."
  },
  {
    id: 33,
    difficulty: "Medium",
    category: "Strategic Planning",
    question: "What does portfolio analysis mainly help management do?",
    options: [
      "Choose office furniture",
      "Evaluate which businesses or products to support more and which to support less",
      "Set employee salaries",
      "Avoid setting objectives"
    ],
    correctIndex: 1,
    explanation:
      "Portfolio analysis helps management decide where to invest, keep focus, or reduce commitment."
  },
  {
    id: 34,
    difficulty: "Medium",
    category: "Strategic Planning",
    question: "SBU stands for:",
    options: ["Sales budget unit", "Strategic business unit", "Social branding unit", "Standard buying unit"],
    correctIndex: 1,
    explanation:
      "SBU means strategic business unit, a unit that can be planned separately within the business portfolio."
  },
  {
    id: 35,
    difficulty: "Medium",
    category: "Strategic Planning",
    question: "Which tool is useful for identifying growth opportunities?",
    options: ["SWOT heat map", "Product/market expansion grid", "Value chain table", "PEST barometer"],
    correctIndex: 1,
    explanation:
      "The notes mention the product/market expansion grid as a useful tool for identifying growth opportunities."
  },
  {
    id: 36,
    difficulty: "Medium",
    category: "Marketing Management",
    question: "Which of the following is one of the five marketing management functions?",
    options: ["Recruitment", "Analysis", "Procurement", "Auditing"],
    correctIndex: 1,
    explanation:
      "The five marketing management functions are analysis, planning, implementation, organization, and control."
  },
  {
    id: 37,
    difficulty: "Medium",
    category: "Marketing Management",
    question: "Which tool should be used to analyze the current marketing plan?",
    options: ["BCG matrix only", "SWOT analysis", "Net present value", "Focus group only"],
    correctIndex: 1,
    explanation:
      "The notes explicitly say SWOT should be used to analyze the current marketing plan."
  },
  {
    id: 38,
    difficulty: "Medium",
    category: "Marketing Plan",
    question: "Which of the following is part of a marketing plan?",
    options: ["Executive summary", "Patent register", "Factory blueprint", "Payroll analysis"],
    correctIndex: 0,
    explanation:
      "The marketing plan includes items such as executive summary, current situation, threats and opportunities, objectives, action programs, budgets, and controls."
  },
  {
    id: 39,
    difficulty: "Medium",
    category: "Marketing Information",
    question: "Competitive marketing intelligence is best described as:",
    options: [
      "Illegal spying on competitors",
      "Systematic monitoring and analysis of publicly available information about consumers, competitors, and marketplace developments",
      "A type of internal budgeting system",
      "A way to reduce customer data"
    ],
    correctIndex: 1,
    explanation:
      "Competitive marketing intelligence uses publicly available information to understand competitors, customers, and market developments."
  },
  {
    id: 40,
    difficulty: "Medium",
    category: "Marketing Information",
    question: "What is the main goal of competitive marketing intelligence?",
    options: [
      "To replace all managers",
      "To understand the environment, track competitors, and identify threats and opportunities early",
      "To reduce all marketing research costs",
      "To collect only internal company data"
    ],
    correctIndex: 1,
    explanation:
      "Its goal is to understand the environment, track competitor actions, and provide early warnings of opportunities and threats."
  },
  {
    id: 41,
    difficulty: "Medium",
    category: "Marketing Research",
    question: "What is the first step in the marketing research process?",
    options: ["Developing the research plan", "Implementing the research plan", "Defining the problem and research objectives", "Interpreting the findings"],
    correctIndex: 2,
    explanation:
      "Marketing research starts by defining the problem and the research objectives."
  },
  {
    id: 42,
    difficulty: "Medium",
    category: "Marketing Research",
    question: "Exploratory research is used to:",
    options: [
      "Describe market characteristics in detail only",
      "Test cause-and-effect relationships only",
      "Gather preliminary information that helps define the problem and suggest hypotheses",
      "Replace sampling"
    ],
    correctIndex: 2,
    explanation:
      "Exploratory research helps clarify the problem and generate ideas or hypotheses."
  },
  {
    id: 43,
    difficulty: "Medium",
    category: "Marketing Research",
    question: "Descriptive research is mainly used to:",
    options: [
      "Describe things such as market potential or customer demographics",
      "Create prototypes",
      "Eliminate the need for data collection",
      "Study only internal accounting systems"
    ],
    correctIndex: 0,
    explanation:
      "Descriptive research describes markets, customer attitudes, demographics, and related conditions."
  },
  {
    id: 44,
    difficulty: "Medium",
    category: "Marketing Research",
    question: "Causal research is mainly used to:",
    options: [
      "Test hypotheses about cause-and-effect relationships",
      "Describe consumer age groups",
      "Classify products",
      "Set distribution margins"
    ],
    correctIndex: 0,
    explanation:
      "Causal research is designed to test cause-and-effect relationships."
  },
  {
    id: 45,
    difficulty: "Medium",
    category: "Marketing Research",
    question: "When developing a research plan, firms usually start with:",
    options: ["Primary data", "Secondary data", "Experiments only", "Observation only"],
    correctIndex: 1,
    explanation:
      "The notes say firms usually start with secondary data before collecting primary data."
  },
  {
    id: 46,
    difficulty: "Medium",
    category: "Marketing Research",
    question: "Which of the following is a method of collecting primary data?",
    options: ["Survey", "Annual report archive", "Government database only", "Competitor brochure"],
    correctIndex: 0,
    explanation:
      "Primary data can be collected through methods such as observation, surveys, and experiments."
  },
  {
    id: 47,
    difficulty: "Medium",
    category: "Marketing Research",
    question: "A sample in marketing research is:",
    options: [
      "The full population being studied",
      "A segment of the population selected to represent the population as a whole",
      "A random product example",
      "A set of only loyal customers"
    ],
    correctIndex: 1,
    explanation:
      "A sample is a selected part of the population used to represent the larger whole."
  },
  {
    id: 48,
    difficulty: "Medium",
    category: "Environment",
    question: "The marketing environment is defined as:",
    options: [
      "Internal budgeting systems only",
      "Actors and forces outside marketing that affect marketing management’s ability to build successful customer relationships",
      "Only the company’s own departments",
      "A list of competitors"
    ],
    correctIndex: 1,
    explanation:
      "The marketing environment includes outside actors and forces that affect how well the company can serve customers."
  },
  {
    id: 49,
    difficulty: "Medium",
    category: "Environment",
    question: "How many major components are listed in the company’s microenvironment?",
    options: ["Four", "Five", "Six", "Seven"],
    correctIndex: 2,
    explanation:
      "The notes list six components: the company, suppliers, marketing intermediaries, competitors, publics, and customers."
  },
  {
    id: 50,
    difficulty: "Medium",
    category: "Environment",
    question: "Generational marketing refers to marketing efforts targeted at:",
    options: ["Only children", "Only retirees", "Specific generational groups such as Gen X, Millennials, or Gen Z", "Only business buyers"],
    correctIndex: 2,
    explanation:
      "Generational marketing targets age-based cohorts such as baby boomers, Gen X, Millennials, or Gen Z."
  },
  {
    id: 51,
    difficulty: "Medium",
    category: "Consumer Behavior",
    question: "In the simple model of buyer behavior, the buyer’s black box stands between:",
    options: ["Advertising and pricing", "Environment and buyer response", "Need recognition and post-purchase behavior", "Seller and supplier"],
    correctIndex: 1,
    explanation:
      "The model in the notes is Environment → Buyer’s black box → Buyer response."
  },
  {
    id: 52,
    difficulty: "Medium",
    category: "Consumer Behavior",
    question: "A membership group is a group that:",
    options: ["A person wants to join someday", "Has a direct influence and to which a person belongs", "Exists only online", "Sells products to the buyer"],
    correctIndex: 1,
    explanation:
      "Membership groups are groups with direct influence that the person actually belongs to."
  },
  {
    id: 53,
    difficulty: "Medium",
    category: "Consumer Behavior",
    question: "Aspirational groups are groups that an individual:",
    options: ["Currently leads", "Tries to avoid", "Wishes to belong to", "Is automatically born into"],
    correctIndex: 2,
    explanation:
      "An aspirational group is one the individual wants to belong to, even if they are not part of it yet."
  },
  {
    id: 54,
    difficulty: "Medium",
    category: "Consumer Behavior",
    question: "Which role in the buying process first suggests the idea of buying a product?",
    options: ["Buyer", "Influencer", "Initiator", "User"],
    correctIndex: 2,
    explanation:
      "The initiator is the person who first suggests or thinks of buying the product."
  },
  {
    id: 55,
    difficulty: "Medium",
    category: "Consumer Behavior",
    question: "Which role in the buying process carries views or advice that may influence the decision?",
    options: ["User", "Influencer", "Buyer", "Initiator"],
    correctIndex: 1,
    explanation:
      "The influencer is the person whose advice or views carry weight in the decision process."
  },
  {
    id: 56,
    difficulty: "Medium",
    category: "Innovation Adoption",
    question: "Adoption is best defined as:",
    options: [
      "Hearing about an innovation for the first time",
      "Trying a product one time",
      "The decision to become a regular user of the product",
      "Comparing brands before purchase"
    ],
    correctIndex: 2,
    explanation:
      "Adoption means deciding to make full and regular use of the product."
  },
  {
    id: 57,
    difficulty: "Medium",
    category: "Innovation Adoption",
    question: "Which adopter group comes immediately after innovators?",
    options: ["Late mainstream", "Lagging adopters", "Early adopters", "Early mainstream"],
    correctIndex: 2,
    explanation:
      "The notes list innovators first, followed by early adopters."
  },
  {
    id: 58,
    difficulty: "Medium",
    category: "Innovation Adoption",
    question: "Relative advantage means:",
    options: [
      "The degree to which an innovation appears superior to existing products",
      "The price difference between two stores",
      "How often a salesperson calls",
      "Whether a product is available globally"
    ],
    correctIndex: 0,
    explanation:
      "Relative advantage is the extent to which the innovation seems better than existing alternatives."
  },
  {
    id: 59,
    difficulty: "Medium",
    category: "Innovation Adoption",
    question: "Compatibility refers to whether an innovation:",
    options: [
      "Can be shipped internationally",
      "Fits the values and experiences of potential consumers",
      "Has the lowest price in the market",
      "Can be patented"
    ],
    correctIndex: 1,
    explanation:
      "Compatibility is about how well the innovation fits consumers’ values and current lives."
  },
  {
    id: 60,
    difficulty: "Medium",
    category: "Innovation Adoption",
    question: "Divisibility refers to:",
    options: [
      "Whether the product can be split across departments",
      "Whether the innovation can be tried on a limited basis",
      "Whether the product is sold in bundles",
      "Whether customers can compare prices online"
    ],
    correctIndex: 1,
    explanation:
      "Divisibility means consumers can test or try the innovation on a limited basis."
  },
  {
    id: 61,
    difficulty: "Medium",
    category: "Business Markets",
    question: "Compared with consumer markets, business markets usually have:",
    options: [
      "More buyers with smaller order sizes",
      "Fewer buyers but much larger purchases",
      "Only emotional decision making",
      "No dependence between buyer and seller"
    ],
    correctIndex: 1,
    explanation:
      "The notes say business markets usually have far fewer buyers, but each buyer is much larger."
  },
  {
    id: 62,
    difficulty: "Medium",
    category: "Business Markets",
    question: "Business demand is described as derived demand because it:",
    options: [
      "Comes from government policy",
      "Ultimately comes from demand for consumer goods",
      "Depends only on the weather",
      "Is created by suppliers"
    ],
    correctIndex: 1,
    explanation:
      "Business demand is derived from demand further down the chain, especially consumer demand."
  },
  {
    id: 63,
    difficulty: "Medium",
    category: "Business Markets",
    question: "Which business buying situation involves some modifications in price, terms, or product specifications?",
    options: ["Straight rebuy", "Modified rebuy", "New task", "Routine reorder"],
    correctIndex: 1,
    explanation:
      "A modified rebuy means the buyer wants some changes, such as price, terms, or specifications."
  },
  {
    id: 64,
    difficulty: "Medium",
    category: "Business Markets",
    question: "What is the buying center in a business?",
    options: [
      "The warehouse where products are stored",
      "The group that manages the buying process",
      "The online payment system",
      "The marketing department only"
    ],
    correctIndex: 1,
    explanation:
      "The buying center is the group or unit that manages the buying process in a business."
  },
  {
    id: 65,
    difficulty: "Medium",
    category: "Business Markets",
    question: "B2B e-procurement allows companies to:",
    options: [
      "Only sell directly to consumers",
      "Set up buying needs online so suppliers can bid",
      "Avoid all supplier comparisons",
      "Replace performance review"
    ],
    correctIndex: 1,
    explanation:
      "B2B e-procurement means firms can post needs online and let suppliers bid for the contract."
  },
  {
    id: 66,
    difficulty: "Hard",
    category: "Marketing Fundamentals",
    question: "What is the main purpose of the first four steps of the marketing process?",
    options: [
      "To reduce taxes and compliance costs",
      "To create value for customers",
      "To eliminate all competition",
      "To maximize short-term production volume"
    ],
    correctIndex: 1,
    explanation:
      "The first four steps focus on understanding customers, designing strategy, building value, and engaging customers. Together, these steps create value for customers."
  },
  {
    id: 67,
    difficulty: "Hard",
    category: "Marketing Fundamentals",
    question: "In the Apple battery-life example, the key lesson is that marketers should emphasize:",
    options: [
      "Technical metrics only",
      "The customer benefit rather than the technical specification",
      "The factory process behind the product",
      "Competitor weaknesses only"
    ],
    correctIndex: 1,
    explanation:
      "The idea is to market what the customer actually cares about, such as long battery life, not only technical units like mAh."
  },
  {
    id: 68,
    difficulty: "Hard",
    category: "Strategy",
    question: "Why is targeting linked closely to value creation?",
    options: [
      "Because companies should target everyone to create the most value",
      "Because firms should choose the segments where they can create the greatest value profitably and sustain it over time",
      "Because value creation happens only after the sale",
      "Because value creation depends only on promotion"
    ],
    correctIndex: 1,
    explanation:
      "The notes connect targeting to selecting segments in which the firm can profitably generate and sustain the greatest customer value."
  },
  {
    id: 69,
    difficulty: "Hard",
    category: "Strategic Planning",
    question: "Which statement is the best example of a market-oriented business definition?",
    options: [
      "We sell coffee",
      "We run discount stores",
      "We sell the Starbucks experience",
      "We manufacture beverages in multiple sizes"
    ],
    correctIndex: 2,
    explanation:
      "A market-oriented definition focuses on the customer value delivered, not just on the product itself."
  },
  {
    id: 70,
    difficulty: "Hard",
    category: "Strategic Planning",
    question: "Why do managers analyze the current business portfolio?",
    options: [
      "To identify which businesses and products deserve more or less investment",
      "To choose the company logo",
      "To replace mission statements",
      "To avoid future growth planning"
    ],
    correctIndex: 0,
    explanation:
      "Portfolio analysis helps managers allocate resources by focusing more on profitable or promising units and less on weaker ones."
  },
  {
    id: 71,
    difficulty: "Hard",
    category: "Marketing Management",
    question: "Why is control one of the five marketing management functions?",
    options: [
      "Because marketing plans should never be checked after implementation",
      "Because firms need to evaluate results and adjust when necessary",
      "Because control replaces planning",
      "Because control only matters in B2B markets"
    ],
    correctIndex: 1,
    explanation:
      "Control matters because marketing efforts need to be monitored and adjusted based on performance."
  },
  {
    id: 72,
    difficulty: "Hard",
    category: "Marketing Information",
    question: "Why should firms be careful with MKIS and large amounts of information?",
    options: [
      "Because more information is always harmful",
      "Because too much information can lead to overanalysis and distraction",
      "Because information systems are only for finance",
      "Because public information is illegal to use"
    ],
    correctIndex: 1,
    explanation:
      "The notes warn that large amounts of information are generated, so firms should avoid analyzing too much without focus."
  },
  {
    id: 73,
    difficulty: "Hard",
    category: "Marketing Information",
    question: "Monitoring social media as part of competitive marketing intelligence is useful because it can:",
    options: [
      "Eliminate the need for research planning",
      "Provide early insights into competitor moves and enable quick responses",
      "Guarantee customer loyalty",
      "Replace segmentation"
    ],
    correctIndex: 1,
    explanation:
      "The notes mention that monitoring social media can reveal competitor moves early and support in-the-moment responses."
  },
  {
    id: 74,
    difficulty: "Hard",
    category: "Marketing Research",
    question: "Why do firms often start with secondary data before collecting primary data?",
    options: [
      "Because primary data is always less accurate",
      "Because existing information can be gathered first before spending time and resources collecting new data",
      "Because primary data cannot be collected online",
      "Because secondary data replaces all surveys"
    ],
    correctIndex: 1,
    explanation:
      "Starting with secondary data is efficient because it uses already available information before collecting new data."
  },
  {
    id: 75,
    difficulty: "Hard",
    category: "Environment",
    question: "Why are macroenvironmental forces important even though they are outside the firm’s direct control?",
    options: [
      "Because they shape the broader conditions that influence the company’s ability to serve customers",
      "Because they only matter for public companies",
      "Because they replace the microenvironment",
      "Because they are identical to internal operations"
    ],
    correctIndex: 0,
    explanation:
      "Macro forces shape the broader environment around the company and influence what is possible in serving customers."
  },
  {
    id: 76,
    difficulty: "Hard",
    category: "Environment",
    question: "According to the notes, how should companies ideally respond to environmental changes whenever possible?",
    options: [
      "By ignoring them until sales fall",
      "By staying passive and adapting only after pressure builds",
      "By being proactive rather than reactive",
      "By focusing only on internal departments"
    ],
    correctIndex: 2,
    explanation:
      "The notes explicitly say companies should try to be proactive rather than reactive whenever possible."
  },
  {
    id: 77,
    difficulty: "Hard",
    category: "Consumer Behavior",
    question: "Why is understanding the 'why' of buying behavior so important in marketing?",
    options: [
      "Because marketers only need to know what customers bought yesterday",
      "Because the goal of marketing is to affect how customers think and behave toward the organization and its offerings",
      "Because buying behavior is simple and obvious",
      "Because only price affects buying decisions"
    ],
    correctIndex: 1,
    explanation:
      "The notes say the aim of marketing is to affect how customers think and behave, so marketers must understand the deeper reasons behind buying behavior."
  },
  {
    id: 78,
    difficulty: "Hard",
    category: "Consumer Behavior",
    question: "Why is post-purchase behavior especially important?",
    options: [
      "Because customers never evaluate products after buying them",
      "Because satisfaction or dissatisfaction after purchase influences future behavior",
      "Because it replaces need recognition",
      "Because it only matters for luxury products"
    ],
    correctIndex: 1,
    explanation:
      "Post-purchase behavior matters because customers evaluate whether the product met expectations, and that affects future purchases and loyalty."
  },
  {
    id: 79,
    difficulty: "Hard",
    category: "Innovation Adoption",
    question: "Why does higher trialability usually increase adoption speed?",
    options: [
      "Because consumers can experience the innovation on a limited basis and reduce uncertainty",
      "Because it makes products more expensive",
      "Because it removes the need for awareness",
      "Because only innovators use trials"
    ],
    correctIndex: 0,
    explanation:
      "When people can try an innovation on a limited basis, uncertainty falls and adoption becomes more likely."
  },
  {
    id: 80,
    difficulty: "Hard",
    category: "Innovation Adoption",
    question: "Why do marketers often focus on early adopters for new products?",
    options: [
      "Because early adopters are the last group to respond",
      "Because early adopters help spread awareness and influence later groups",
      "Because early adopters always demand the lowest prices",
      "Because only early adopters ever make repeat purchases"
    ],
    correctIndex: 1,
    explanation:
      "Early adopters matter because they often influence broader acceptance and can accelerate diffusion."
  },
  {
    id: 81,
    difficulty: "Hard",
    category: "Business Markets",
    question: "Why do business markets often have closer buyer-seller relationships than consumer markets?",
    options: [
      "Because business markets have fewer buyers and greater dependence between the parties",
      "Because all business purchases are emotional",
      "Because consumers never interact with sellers",
      "Because business products are always cheaper"
    ],
    correctIndex: 0,
    explanation:
      "With fewer buyers and larger transactions, business markets often create stronger dependencies and closer buyer-seller relationships."
  },
  {
    id: 82,
    difficulty: "Hard",
    category: "Business Markets",
    question: "Which buying situation is most likely to involve all eight stages of the business buying decision process?",
    options: ["Straight rebuy", "Modified rebuy", "New task", "Routine reorder"],
    correctIndex: 2,
    explanation:
      "A new task usually involves the most uncertainty and risk, so the buyer is most likely to go through all eight stages."
  },
  {
    id: 83,
    difficulty: "Hard",
    category: "Business Markets",
    question: "Which of the following is the correct order of the first four stages in the business buying decision process?",
    options: [
      "Supplier search, problem recognition, product specification, proposal solicitation",
      "Problem recognition, general need description, product specification, supplier search",
      "General need description, order-routine specification, product specification, supplier search",
      "Problem recognition, supplier selection, product specification, performance review"
    ],
    correctIndex: 1,
    explanation:
      "The first four stages are problem recognition, general need description, product specification, and supplier search."
  },
  {
    id: 84,
    difficulty: "Hard",
    category: "Business Markets",
    question: "Why can a new-task purchase involve more decision participants and more information gathering?",
    options: [
      "Because it is the first time the purchase is made and often carries more cost or risk",
      "Because it is always cheaper than a straight rebuy",
      "Because it removes the need for supplier search",
      "Because the buying center is smaller"
    ],
    correctIndex: 0,
    explanation:
      "The notes say new-task purchases often involve higher risk or cost, which leads to more participants and more information collection."
  }
];

type QuizQuestion = (typeof questions)[number];

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 } as const;
type DifficultyKey = keyof typeof difficultyOrder;

function difficultyRank(difficulty: string): number {
  return difficultyOrder[difficulty as DifficultyKey] ?? 0;
}
const categoryColors: Record<string, string> = {
  "Marketing Fundamentals": "bg-slate-100 text-slate-700",
  Strategy: "bg-blue-100 text-blue-700",
  CRM: "bg-emerald-100 text-emerald-700",
  "Strategic Planning": "bg-violet-100 text-violet-700",
  Environment: "bg-amber-100 text-amber-700",
  "Consumer Behavior": "bg-rose-100 text-rose-700",
  "Innovation Adoption": "bg-cyan-100 text-cyan-700",
  "Business Markets": "bg-orange-100 text-orange-700",
  Orientations: "bg-fuchsia-100 text-fuchsia-700"
};

export default function MarketingExamQuizApp() {
  const orderedQuestions = useMemo(
    () =>
      [...questions].sort(
        (a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty) || a.id - b.id
      ),
    []
  );

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = orderedQuestions[current];
  const total = orderedQuestions.length;
  const progress = ((Object.keys(answers).length) / total) * 100;

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    setAnswers((prev) => ({ ...prev, [question.id]: index }));
  };

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers({});
    setFinished(false);
    setShowExplanation(false);
  };

  const score = orderedQuestions.filter((q) => answers[q.id] === q.correctIndex).length;
  const groupedReview = orderedQuestions.reduce<Record<string, QuizQuestion[]>>((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900 p-3 text-white">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">Quiz complete</CardTitle>
                    <CardDescription>
                      You already saw the explanation after each answer. Here is your final score and review.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Score</div>
                    <div className="text-3xl font-bold">{score} / {total}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Accuracy</div>
                    <div className="text-3xl font-bold">{Math.round((score / total) * 100)}%</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Difficulty path</div>
                    <div className="text-3xl font-bold">Easy → Hard</div>
                  </div>
                </div>

                <Button onClick={handleRestart} className="rounded-2xl">
                  <RotateCcw className="mr-2 h-4 w-4" /> Restart quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-5">
            {Object.entries(groupedReview).map(([category, items], idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card className="rounded-3xl shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <BookOpen className="h-5 w-5" /> {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((q) => {
                      const userAnswer = answers[q.id];
                      const correct = userAnswer === q.correctIndex;
                      return (
                        <div key={q.id} className="rounded-2xl border border-slate-200 p-4">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge className={categoryColors[q.category] || "bg-slate-100 text-slate-700"}>{q.category}</Badge>
                            <Badge variant="outline">{q.difficulty}</Badge>
                            {correct ? (
                              <Badge className="bg-emerald-100 text-emerald-700">Correct</Badge>
                            ) : (
                              <Badge className="bg-rose-100 text-rose-700">Incorrect</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-900">{q.question}</h3>
                          <p className="mt-2 text-sm text-slate-600">
                            <span className="font-medium">Your answer:</span> {q.options[userAnswer]}
                          </p>
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Correct answer:</span> {q.options[q.correctIndex]}
                          </p>
                          <p className="mt-3 text-sm leading-6 text-slate-700">{q.explanation}</p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-3xl">Marketing Exam Quiz</CardTitle>
                  <CardDescription>
                    Multiple-choice practice in English, based on your notes, starting easy and getting harder.
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleRestart} className="rounded-2xl">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Progress</span>
                  <span>{Object.keys(answers).length} / {total}</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Question {current + 1} of {total}</Badge>
                  <Badge className={categoryColors[question.category] || "bg-slate-100 text-slate-700"}>{question.category}</Badge>
                  <Badge variant="outline">{question.difficulty}</Badge>
                </div>
                <CardTitle className="text-2xl leading-tight">{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {question.options.map((option, index) => {
                    const isChosen = selected === index;
                    const isCorrect = selected !== null && index === question.correctIndex;
                    const isWrongChosen = selected !== null && isChosen && index !== question.correctIndex;

                    let classes = "w-full justify-start whitespace-normal rounded-2xl border px-4 py-6 text-left h-auto ";
                    if (selected === null) {
                      classes += "border-slate-200 bg-white hover:bg-slate-50";
                    } else if (isCorrect) {
                      classes += "border-emerald-300 bg-emerald-50";
                    } else if (isWrongChosen) {
                      classes += "border-rose-300 bg-rose-50";
                    } else {
                      classes += "border-slate-200 bg-slate-50";
                    }

                    return (
                      <Button key={index} variant="ghost" className={classes} onClick={() => handleSelect(index)}>
                        <div className="flex w-full items-start justify-between gap-4">
                          <span className="text-sm md:text-base">{option}</span>
                          {selected !== null && isCorrect && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />}
                          {selected !== null && isWrongChosen && <XCircle className="mt-0.5 h-5 w-5 shrink-0" />}
                        </div>
                      </Button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-slate-50 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      {selected === question.correctIndex ? (
                        <Badge className="bg-emerald-100 text-emerald-700">Correct</Badge>
                      ) : (
                        <Badge className="bg-rose-100 text-rose-700">Incorrect</Badge>
                      )}
                      <Badge variant="outline">Correct answer: {question.options[question.correctIndex]}</Badge>
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{question.explanation}</p>
                  </motion.div>
                )}

                <div className="flex justify-end pt-2">
                  <Button onClick={handleNext} disabled={selected === null} className="rounded-2xl px-6">
                    {current === total - 1 ? "Finish quiz" : "Next question"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
