import Link from 'next/link';
import { ArrowRight, DollarSign, User, Calendar, MapPin, Building, Sparkles, ExternalLink, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Funding opportunities data
const nationalFunding = [
  {
    id: 1,
    title: "Visual Arts Production Fund",
    org: "CENDANA",
    badge: "Government Agency",
    badgeType: "government",
    description: "Funding for creation of new visual artworks, from paintings to installations. Supports Malaysian artists in developing ambitious new projects.",
    amount: "Up to RM30,000",
    eligibility: "Malaysian visual artists",
    deadline: "Rolling applications",
    link: "https://www.cendana.com.my/opportunities/our-funding-programmes/visual-arts-production-funding-programme",
    linkText: "Apply Now",
  },
  {
    id: 2,
    title: "ArtsFAS Grant",
    org: "Yayasan Hasanah",
    badge: "Foundation",
    badgeType: "foundation",
    description: "Malaysia's largest arts grant supporting performing arts, visual arts, traditional arts, and cultural heritage projects. High impact funding for established and emerging artists.",
    amount: "Up to RM250,000",
    eligibility: "Malaysian artists & organisations",
    deadline: "Annual cycle (check website)",
    link: "https://artsfas.org",
    linkText: "Learn More",
  },
  {
    id: 3,
    title: "Matching Fund",
    org: "MyCreative Ventures",
    badge: "Government Investment",
    badgeType: "government",
    description: "Government investment arm providing matching funds for creative industry projects. Ideal for artists with existing funding seeking to scale their projects.",
    amount: "Up to RM250,000 (matching)",
    eligibility: "Creative industry enterprises",
    requirement: "Existing matched funding",
    link: "https://www.mycreative.com.my/mycreativematchingfund",
    linkText: "Learn More",
  },
  {
    id: 4,
    title: "Art in The City",
    org: "CENDANA",
    badge: "Government Agency",
    badgeType: "government",
    description: "Funding for public art commissions that activate urban spaces. Perfect for muralists, sculptors, and installation artists looking to create community-focused works.",
    amount: "Up to RM100,000",
    focus: "Public art & urban spaces",
    deadline: "Rolling applications",
    link: "https://www.cendana.com.my",
    linkText: "Apply Now",
  },
  {
    id: 5,
    title: "George Town Grants Programme",
    org: "Think City",
    badge: "Urban Regeneration",
    badgeType: "foundation",
    description: "Grants for heritage conservation, cultural mapping, and community spaces in George Town. RM16.3 million distributed since 2009 with 2.25x economic multiplier.",
    amount: "Varies by project",
    location: "George Town heritage zone",
    categories: "Conservation, cultural mapping, shared spaces",
    link: "https://thinkcity.com.my/our-work/george-town-transformation-programme",
    linkText: "Learn More",
  },
  {
    id: 6,
    title: "George Town Festival 2025",
    org: "GTWHI",
    badge: "Open Call",
    badgeType: "competition",
    description: "Annual festival open call for theatre, music, dance, visual art, and performance. Artist residencies available (1-3 months). 2025 festival runs August 2-10.",
    festival: "August 2-10, 2025",
    residency: "1-3 months (March-June)",
    theme: '"Beyond Boundaries"',
    link: "https://www.georgetownfestival.com",
    linkText: "Submit Proposal",
  },
];

const localPrograms = [
  {
    name: "Spotlight 2025",
    org: "Penang Art District + UOB",
    description: "8th edition of the young artist competition. Top 20 get group exhibition, 5 finalists receive RM1,000 each, grand prize includes RM5,000 + mentorship + solo exhibition. For artists under 35.",
    link: "https://penangartdistrict.com/spotlight-2025-by-penang-art-district/",
    linkText: "Apply Now",
  },
  {
    name: "Innovation & Creative Entrepreneurship",
    org: "Penang Art District",
    description: "Program for visual artists, performing artists, artisans, and music producers. Offers peer-learning, mentorship, and networking to build an interconnected creative community.",
    link: "https://penangartdistrict.com",
    linkText: "Learn More",
  },
  {
    name: "BELALANG CAO CAO",
    org: "Translocal Performance Lab",
    description: "Fully-funded performance lab for Southeast Asian artists. Cross-border collaboration and residency opportunities for performing artists.",
    link: "https://www.georgetownfestival.com",
    linkText: "Learn More",
  },
  {
    name: "Hin Market",
    org: "Hin Bus Depot",
    description: "Weekly market (Sat-Sun, 11am-5pm) for artists and makers to sell directly to the public. Low barrier entry for emerging artists to test the market.",
    link: "https://hinbusdepot.com",
    linkText: "Learn More",
  },
  {
    name: "artiKARYA",
    org: "Yayasan Hasanah + Giclee Art",
    description: "Print reproduction partnership launched in Penang (2023). Offers mentorship, high-quality reproductions, and royalty management for visual artists.",
    link: "https://www.artikarya.my/about/",
    linkText: "Apply",
  },
  {
    name: "Little Penang Street Market",
    org: "Monthly Market",
    description: "Last Sunday of every month on Upper Penang Road. Popular venue for jewelry, batik, paintings, and handmade crafts. Great exposure to tourists and locals.",
    link: "#",
    linkText: "Contact Organizers",
  },
];

const tips = [
  {
    number: "01",
    title: "Start Early",
    description: "Begin your application at least 4-6 weeks before the deadline. Quality proposals take time to develop, and you may need supporting documents.",
  },
  {
    number: "02",
    title: "Be Specific",
    description: "Vague proposals fail. Include concrete timelines, budgets, and measurable outcomes. Funders want to know exactly what they're supporting.",
  },
  {
    number: "03",
    title: "Show Community Impact",
    description: "Explain how your project benefits the wider community, not just yourself. Workshops, public exhibitions, and educational components strengthen applications.",
  },
  {
    number: "04",
    title: "Document Your Track Record",
    description: "Include evidence of past work, exhibitions, and completed projects. Photos, press coverage, and testimonials build credibility.",
  },
];

export default function FundingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero Section */}
      <section className="pt-36 pb-16 relative overflow-hidden">
        {/* Decorative gradients */}
        <div className="absolute -top-[30%] -right-[15%] w-[600px] h-[600px] bg-[radial-gradient(circle,var(--color-ochre)_0%,transparent_70%)] opacity-10 blur-[100px]" />
        <div className="absolute -bottom-[40%] -left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,var(--color-teal)_0%,transparent_70%)] opacity-[0.08] blur-[80px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[var(--color-teal)] uppercase tracking-[0.2em]">
              Resources
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-[var(--color-soft-black)] mt-4 leading-tight tracking-tight">
              Funding <em className="text-[var(--color-terracotta)]">Opportunities</em>
            </h1>
            <p className="mt-6 text-lg text-[var(--color-charcoal)]/70 max-w-xl mx-auto">
              Navigate grants, programs, and support for Penang artists. From national funding bodies to local initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="max-w-4xl mx-auto px-6 -mt-4 mb-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center md:border-r md:border-black/5">
              <p className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-teal)]">
                RM4.2M+
              </p>
              <p className="text-sm text-[var(--color-charcoal)]/60 mt-1">
                Distributed by ArtsFAS in 2022
              </p>
            </div>
            <div className="text-center md:border-r md:border-black/5">
              <p className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-teal)]">
                RM250K
              </p>
              <p className="text-sm text-[var(--color-charcoal)]/60 mt-1">
                Max matching fund available
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-teal)]">
                3,000+
              </p>
              <p className="text-sm text-[var(--color-charcoal)]/60 mt-1">
                Artists supported annually
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* National Funding Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[var(--color-ochre)] uppercase tracking-[0.2em]">
              National Funding
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-normal text-[var(--color-soft-black)] mt-2">
              Major Grant Programs
            </h2>
            <p className="mt-3 text-[var(--color-charcoal)]/70 max-w-xl mx-auto">
              Federal and foundation-level funding available to Penang-based artists and creatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nationalFunding.map((fund) => (
              <article
                key={fund.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 flex flex-col"
              >
                <div className="p-6 border-b border-black/5">
                  <span className={`inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${
                    fund.badgeType === 'government' ? 'bg-[var(--color-teal)]/10 text-[var(--color-teal)]' :
                    fund.badgeType === 'foundation' ? 'bg-[var(--color-ochre)]/10 text-amber-700' :
                    fund.badgeType === 'competition' ? 'bg-[var(--color-deep-teal)]/10 text-[var(--color-deep-teal)]' :
                    'bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]'
                  }`}>
                    {fund.badge}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mt-3">
                    {fund.title}
                  </h3>
                  <p className="text-sm text-[var(--color-charcoal)]/70 mt-1">{fund.org}</p>
                </div>

                <div className="p-6 flex-grow">
                  <p className="text-sm text-[var(--color-charcoal)] leading-relaxed mb-4">
                    {fund.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    {fund.amount && (
                      <div className="flex items-start gap-2">
                        <DollarSign className="w-4 h-4 text-[var(--color-teal)] mt-0.5 flex-shrink-0" />
                        <span className="text-[var(--color-charcoal)]/60">Amount:</span>
                        <span className="font-medium text-[var(--color-charcoal)]">{fund.amount}</span>
                      </div>
                    )}
                    {fund.eligibility && (
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-[var(--color-teal)] mt-0.5 flex-shrink-0" />
                        <span className="text-[var(--color-charcoal)]/60">Eligibility:</span>
                        <span className="font-medium text-[var(--color-charcoal)]">{fund.eligibility}</span>
                      </div>
                    )}
                    {fund.deadline && (
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-[var(--color-teal)] mt-0.5 flex-shrink-0" />
                        <span className="text-[var(--color-charcoal)]/60">Deadline:</span>
                        <span className="font-medium text-[var(--color-charcoal)]">{fund.deadline}</span>
                      </div>
                    )}
                    {fund.location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[var(--color-teal)] mt-0.5 flex-shrink-0" />
                        <span className="text-[var(--color-charcoal)]/60">Location:</span>
                        <span className="font-medium text-[var(--color-charcoal)]">{fund.location}</span>
                      </div>
                    )}
                    {fund.focus && (
                      <div className="flex items-start gap-2">
                        <Building className="w-4 h-4 text-[var(--color-teal)] mt-0.5 flex-shrink-0" />
                        <span className="text-[var(--color-charcoal)]/60">Focus:</span>
                        <span className="font-medium text-[var(--color-charcoal)]">{fund.focus}</span>
                      </div>
                    )}
                    {fund.festival && (
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-[var(--color-teal)] mt-0.5 flex-shrink-0" />
                        <span className="text-[var(--color-charcoal)]/60">Festival:</span>
                        <span className="font-medium text-[var(--color-charcoal)]">{fund.festival}</span>
                      </div>
                    )}
                    {fund.theme && (
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-[var(--color-teal)] mt-0.5 flex-shrink-0" />
                        <span className="text-[var(--color-charcoal)]/60">2026 Theme:</span>
                        <span className="font-medium text-[var(--color-charcoal)]">{fund.theme}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-black/[0.02] border-t border-black/5">
                  <a
                    href={fund.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-teal)] hover:text-[var(--color-deep-teal)] transition-colors group"
                  >
                    {fund.linkText}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[var(--color-deep-teal)] to-[var(--color-teal)] relative overflow-hidden">
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L80 40L40 80L0 40L40 0z' fill='white' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-normal text-white">
              Grant Application Tips
            </h2>
            <p className="mt-2 text-white/70">
              Increase your chances of success with these proven strategies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip) => (
              <div
                key={tip.number}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors hover:-translate-y-1 duration-300"
              >
                <span className="font-display text-4xl font-semibold text-[var(--color-ochre)]">
                  {tip.number}
                </span>
                <h3 className="font-display text-lg font-semibold text-white mt-4 mb-2">
                  {tip.title}
                </h3>
                <p className="text-sm text-white/75 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Programs Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[var(--color-ochre)] uppercase tracking-[0.2em]">
              Penang-Specific
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-normal text-[var(--color-soft-black)] mt-2">
              Local Programs & Opportunities
            </h2>
            <p className="mt-3 text-[var(--color-charcoal)]/70 max-w-xl mx-auto">
              Competitions, mentorships, and support programs based in Penang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localPrograms.map((program, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-l-4 border-[var(--color-ochre)]"
              >
                <h3 className="font-display text-lg font-semibold text-[var(--color-soft-black)]">
                  {program.name}
                </h3>
                <p className="text-xs font-semibold text-[var(--color-teal)] uppercase tracking-wide mt-1">
                  {program.org}
                </p>
                <p className="text-sm text-[var(--color-charcoal)] leading-relaxed mt-4">
                  {program.description}
                </p>
                <a
                  href={program.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-teal)] mt-4 hover:underline"
                >
                  {program.linkText}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-transparent to-[var(--color-warm-white)]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-normal text-[var(--color-soft-black)]">
            Know of other funding opportunities?
          </h2>
          <p className="mt-4 text-[var(--color-charcoal)]/70">
            Help us keep this resource up to date. Share grants, programs, or opportunities we may have missed.
          </p>
          <div className="mt-8">
            <a
              href="mailto:hello@lumina.my?subject=Funding%20Opportunity%20Suggestion"
              className="inline-flex items-center gap-2"
            >
              <Button className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white font-medium px-8 py-6 text-lg rounded-full shadow-lg shadow-[var(--color-teal)]/30">
                <Mail className="w-5 h-5 mr-2" />
                Share a Resource
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
