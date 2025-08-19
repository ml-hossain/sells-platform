import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Linkedin, Mail, Award, Users, Sparkles } from "lucide-react"
import { ScrollReveal } from "@/components/animations/scroll-reveal"

export function MeetCEO() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-electric-50/30 to-violet-50/30" />
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-electric-400/20 to-violet-400/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-violet-400/20 to-emerald-400/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="container relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-electric-100 to-violet-100 text-electric-700 text-sm font-medium mb-4 animate-bounce-in">
              <Sparkles className="h-4 w-4 mr-2" />
              Leadership Excellence
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-electric-600 to-violet-600 bg-clip-text text-transparent">
              Meet Our CEO
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Leading with vision and expertise in international education
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <ScrollReveal delay={200}>
            <Card className="overflow-hidden shadow-2xl hover:shadow-electric-500/20 transition-all duration-500 hover:scale-105 border-2 border-electric-100 hover:border-electric-200">

              <CardContent className="p-0 relative">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-electric-50/30 to-violet-50/30 opacity-0 hover:opacity-100 transition-opacity duration-500" />

                <div className="grid md:grid-cols-2 gap-0 relative z-10">
                  <div className="aspect-square md:aspect-auto relative overflow-hidden">
                    <img
                      src="/placeholder.svg?height=500&width=500&text=Dr.+Michael+Chen+CEO"
                      alt="CEO Portrait"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-electric-900/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-8 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-electric-600 to-violet-600 bg-clip-text text-transparent">
                        Dr. Michael Chen
                      </h3>
                      <p className="text-electric-600 font-semibold mb-4 text-lg">Chief Executive Officer</p>
                      <p className="text-gray-600 leading-relaxed">
                        With over 15 years of experience in international education consulting, Dr. Chen has helped
                        thousands of students achieve their dreams of studying abroad. He holds a PhD in Educational
                        Leadership and has worked with universities across 50+ countries.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-electric-50 to-violet-50 hover:from-electric-100 hover:to-violet-100 transition-all duration-300 cursor-pointer group">
                        <Award className="h-6 w-6 text-electric-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-semibold text-gray-800">15+ Years</div>
                          <div className="text-sm text-gray-600">Experience</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-violet-50 to-emerald-50 hover:from-violet-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer group">
                        <Users className="h-6 w-6 text-violet-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-semibold text-gray-800">10,000+</div>
                          <div className="text-sm text-gray-600">Students Helped</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Qualifications:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-gradient-to-r from-electric-500 to-violet-500 rounded-full mr-3" />
                          PhD in Educational Leadership - Harvard University
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full mr-3" />
                          Master's in International Relations - Oxford University
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-electric-500 rounded-full mr-3" />
                          Certified Immigration Consultant (ICCRC)
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-gradient-to-r from-electric-500 to-sunset-500 rounded-full mr-3" />
                          Member of NAFSA: Association of International Educators
                        </li>
                      </ul>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-electric-200 text-electric-600 hover:bg-electric-50 hover:border-electric-300 transition-all duration-300 hover:scale-105 group bg-transparent"
                      >
                        <Linkedin className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        LinkedIn
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 transition-all duration-300 hover:scale-105 group bg-transparent"
                      >
                        <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
