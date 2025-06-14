"use client";

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, DollarSign, FileCheck, Shield } from "lucide-react"
import { useState } from "react"

export default function FinancingPage() {
  // State for all form fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [stateVal, setStateVal] = useState("")
  const [dob, setDob] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [employed, setEmployed] = useState("")
  const [employmentType, setEmploymentType] = useState("")
  const [income, setIncome] = useState("")
  const [jobTime, setJobTime] = useState("")
  const [coBuyer, setCoBuyer] = useState("no")
  const [vehicleFinance, setVehicleFinance] = useState("")
  const [stockNumber, setStockNumber] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !termsAccepted) {
      setError("Please fill in all required fields and accept the terms.")
      setLoading(false)
      return
    }
    const payload = {
      firstName,
      lastName,
      address,
      city,
      state: stateVal,
      dob,
      email,
      phone,
      employed,
      employmentType,
      income,
      jobTime,
      coBuyer,
      vehicleFinance,
      stockNumber,
      termsAccepted,
    }
    try {
      const res = await fetch(
        "https://services.leadconnectorhq.com/hooks/M06NMlLIex66XPyxMbCj/webhook-trigger/74316e65-4937-4bc9-8d8f-5b9c7a0824d4",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) throw new Error("Submission failed")
      setSuccess("Your application has been submitted successfully!")
    } catch (err) {
      setError("There was an error submitting your application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gray-100 rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Financing Options</h1>
            <p className="text-gray-600 text-lg mb-0">
              Get pre-qualified for financing and drive home your dream car today.
            </p>
          </div>
        </div>
      </section>

      {/* Financing Info */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Flexible Financing Solutions</h2>
            <p className="text-gray-600 mb-4">
              At Wise, we understand that purchasing a luxury vehicle is a significant investment. That's why we
              offer a range of flexible financing options tailored to your specific needs and financial situation.
            </p>
            <p className="text-gray-600 mb-4">
              Our partnerships with leading financial institutions allow us to secure competitive rates and terms for
              our clients, making luxury car ownership more accessible than ever.
            </p>
            <p className="text-gray-600 mb-6">
              Complete the pre-qualification form to get started. This is a soft inquiry that won't affect your credit
              score, and our finance specialists will contact you to discuss your options.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold">Traditional Financing</h3>
                </div>
                <p className="text-gray-600">
                  Secure a traditional auto loan with competitive interest rates and flexible terms ranging from 24 to
                  84 months.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold">Leasing Options</h3>
                </div>
                <p className="text-gray-600">
                  Enjoy lower monthly payments and the flexibility to upgrade to a new vehicle every few years with our
                  leasing programs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200 mb-8">
              <Shield className="h-8 w-8 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">
                <span className="font-semibold">Your privacy is important to us.</span> All information submitted is
                encrypted and secure. We will never share your personal information without your consent.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <FileCheck className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold">What You'll Need</h3>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-green-600 text-xs font-bold">1</span>
                </div>
                <span className="text-gray-600">Valid driver's license or government-issued ID</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-green-600 text-xs font-bold">2</span>
                </div>
                <span className="text-gray-600">Proof of income (pay stubs, tax returns, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-green-600 text-xs font-bold">3</span>
                </div>
                <span className="text-gray-600">Proof of residence (utility bill, lease agreement, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-green-600 text-xs font-bold">5</span>
                </div>
                <span className="text-gray-600">Information about the vehicle you're interested in (optional)</span>
              </li>
            </ul>
            <Separator className="my-6" />
            <div className="text-center">
              <p className="text-gray-600 mb-4">Have questions about financing?</p>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">Contact Our Finance Team</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-qualification Form */}
      <section className="mb-12">
        <div className="bg-white p-8 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Pre-Qualification Application</h2>
          <p className="text-gray-600 mb-8">
            Complete the form below to get pre-qualified for financing. This is a soft inquiry and will not affect your
            credit score.
          </p>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="First Name" className="mt-1" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Last Name" className="mt-1" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Address" className="mt-1" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="City" className="mt-1" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="State" className="mt-1" value={stateVal} onChange={e => setStateVal(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" className="mt-1" value={dob} onChange={e => setDob(e.target.value)} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="Email Address" className="mt-1" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="Phone Number" className="mt-1" required value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Employment Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Employment Information</h3>
              <div className="mb-4">
                <Label className="mb-2 block">Are you currently employed?</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="employedYes" checked={employed === "yes"} onCheckedChange={val => val ? setEmployed("yes") : setEmployed(employed === "no" ? "" : employed)} />
                    <label htmlFor="employedYes" className="text-sm">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="employedNo" checked={employed === "no"} onCheckedChange={val => val ? setEmployed("no") : setEmployed(employed === "yes" ? "" : employed)} />
                    <label htmlFor="employedNo" className="text-sm">
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Label className="mb-2 block">Employment Type</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="fullTime" checked={employmentType === "Full Time"} onCheckedChange={val => val ? setEmploymentType("Full Time") : setEmploymentType(employmentType === "Part Time" ? "" : employmentType)} />
                    <label htmlFor="fullTime" className="text-sm">
                      Full Time
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="partTime" checked={employmentType === "Part Time"} onCheckedChange={val => val ? setEmploymentType("Part Time") : setEmploymentType(employmentType === "Full Time" ? "" : employmentType)} />
                    <label htmlFor="partTime" className="text-sm">
                      Part Time
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="income">Monthly Income (Estimated)</Label>
                  <Input id="income" placeholder="Monthly Income" className="mt-1" value={income} onChange={e => setIncome(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="jobTime">Time on Job (Years)</Label>
                  <Input id="jobTime" placeholder="Years" className="mt-1" value={jobTime} onChange={e => setJobTime(e.target.value)} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Co-Buyer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Co-Buyer Information</h3>
              <div className="mb-4">
                <Label className="mb-2 block">Do you have a co-buyer?</Label>
                <RadioGroup value={coBuyer} onValueChange={setCoBuyer} defaultValue="no">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="cobuyer-yes" />
                    <Label htmlFor="cobuyer-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="cobuyer-no" />
                    <Label htmlFor="cobuyer-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />

            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleFinance">Vehicle To Finance</Label>
                  <Input id="vehicleFinance" placeholder="Year, Make, Model" className="mt-1" value={vehicleFinance} onChange={e => setVehicleFinance(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="stockNumber">Stock Number (if known)</Label>
                  <Input id="stockNumber" placeholder="Stock Number" className="mt-1" value={stockNumber} onChange={e => setStockNumber(e.target.value)} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Terms and Conditions */}
            <div>
              <div className="flex items-start gap-2 mb-6">
                <Checkbox id="terms" className="mt-1" checked={termsAccepted} onCheckedChange={checked => setTermsAccepted(checked === true)} />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I authorize Wise to obtain my credit report and verify other credit information, including
                  past and present mortgage and landlord references. It is understood that a photocopy of this form will
                  also serve as authorization.
                </label>
              </div>
              {error && <div className="text-red-600 mb-2">{error}</div>}
              {success && <div className="text-green-600 mb-2">{success}</div>}
              <Button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold mb-2">What credit score do I need to qualify?</h3>
            <p className="text-gray-600">
              While a higher credit score typically results in better rates, we work with a variety of lenders who
              specialize in different credit profiles. We have financing options for most credit situations.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold mb-2">How long does the approval process take?</h3>
            <p className="text-gray-600">
              In most cases, you'll receive a response within 24 hours of submitting your application. Some approvals
              can be processed even faster.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold mb-2">Will this pre-qualification affect my credit score?</h3>
            <p className="text-gray-600">
              No, this initial pre-qualification is a soft inquiry and will not impact your credit score. A hard inquiry
              will only be made when you decide to proceed with a specific financing option.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold mb-2">Can I apply for financing if I'm self-employed?</h3>
            <p className="text-gray-600">
              Yes, we have financing options for self-employed individuals. You may need to provide additional
              documentation such as tax returns or bank statements to verify your income.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
