import React from "react";
import { Card } from "@/components/ui/card";
import { Heart, Shield, Users, Sparkles } from "lucide-react";

export default function SharedFeatures() {
  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Elysian?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We celebrate the beauty of African culture while connecting hearts
            across our magnificent continent. Find someone who truly understands
            your heritage, values, and dreams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <Card className="p-6 text-center hover-elevate">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Authentic Matching</h3>
            <p className="text-muted-foreground text-sm">
              Our algorithm focuses on compatibility based on shared interests
              and values.
            </p>
          </Card>

          <Card className="p-6 text-center hover-elevate">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Safe & Secure</h3>
            <p className="text-muted-foreground text-sm">
              Your privacy and safety are our top priorities with verified
              profiles.
            </p>
          </Card>

          <Card className="p-6 text-center hover-elevate">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Continental Reach</h3>
            <p className="text-muted-foreground text-sm">
              Connect with amazing people from Lagos to Cairo, Nairobi to
              Casablanca, and everywhere across Africa.
            </p>
          </Card>

          <Card className="p-6 text-center hover-elevate">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Forever Free</h3>
            <p className="text-muted-foreground text-sm">
              All features are completely free. Love shouldn't cost a thing.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
