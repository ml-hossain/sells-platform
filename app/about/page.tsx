"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Globe, TrendingUp, Target, Eye, Heart, Loader2 } from "lucide-react"
import { getTeamMembers } from "@/lib/services/team-service"
import type { TeamMember } from "@/lib/types/team-member"

const stats = [
  { icon: Users, value: "12,500+", label: "Students Helped" },
  { icon: Globe, value: "35+", label: "Countries" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: TrendingUp, value: "96%", label: "Success Rate" },
]

// Team data will be loaded from Firebase

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for excellence in every aspect of our service delivery.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "We maintain the highest standards of honesty and transparency.",
  },
  {
    icon: Users,
    title: "Student-Centric",
    description: "Every decision we make is focused on student success and satisfaction.",
  },
]

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [teamLoading, setTeamLoading] = useState(true)

  // Load team members on component mount
  useEffect(() => {
    loadTeamMembers()
  }, [])

  const loadTeamMembers = async () => {
    try {
      setTeamLoading(true)
      const data = await getTeamMembers()
      setTeam(data)
    } catch (error) {
      // Fall back to showing empty state or placeholder data
      setTeam([])
    } finally {
      setTeamLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="py-8">
      <div className="container space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold">About NextGen EduMigrate Solutions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We are a leading education consultancy dedicated to helping students achieve their dreams of studying
            abroad. With over 15 years of experience, we've successfully guided thousands of students to top
            universities worldwide.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-12">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To empower students worldwide by providing comprehensive, personalized guidance for international
                education opportunities. We believe that quality education should be accessible to all, regardless of
                geographical boundaries.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To be the world's most trusted education consultancy, creating a global community of successful
                international students who contribute positively to society and drive innovation across borders.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          {teamLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading our team...</span>
            </div>
          ) : team.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <Card key={member.id} className="text-center">
                  <CardContent className="p-6">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-r from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                        {getInitials(member.name)}
                      </div>
                    )}
                    <h3 className="text-lg font-bold mb-2">{member.name}</h3>
                    <Badge variant="secondary" className="mb-4">
                      {member.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Our team information will be available soon.</p>
            </div>
          )}
        </section>

        {/* Why Choose Us */}
        <section className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose NextGen EduMigrate?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Expert Guidance</h3>
                  <p className="text-muted-foreground">
                    Our team of certified consultants brings years of experience in international education.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Global Network</h3>
                  <p className="text-muted-foreground">
                    Partnerships with universities across multiple countries worldwide.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Personalized Service</h3>
                  <p className="text-muted-foreground">
                    Tailored solutions based on your unique academic profile and career goals.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Proven Success</h3>
                  <p className="text-muted-foreground">
                    High success rate with thousands of students successfully placed in top universities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">End-to-End Support</h3>
                  <p className="text-muted-foreground">
                    From initial consultation to post-arrival support, we're with you every step.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Transparent Process</h3>
                  <p className="text-muted-foreground">
                    Clear communication and honest guidance throughout your application journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
