import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { toast } from 'sonner';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  facebook: string;
  instagram: string;
  mondayFriday: string;
  saturday: string;
  sunday: string;
}

const defaultContactInfo: ContactInfo = {
  phone: '+254 712 345 678',
  email: 'support@rento.com',
  address: '123 Rental Street',
  city: 'Nairobi, Kenya',
  postalCode: '00100',
  facebook: 'https://facebook.com/rentohomes',
  instagram: 'https://instagram.com/rento_homes',
  mondayFriday: '9:00 AM - 6:00 PM',
  saturday: '10:00 AM - 4:00 PM',
  sunday: 'Closed',
};

export const getContactInfo = (): ContactInfo => {
  const stored = localStorage.getItem('rento_contact_info');
  return stored ? JSON.parse(stored) : defaultContactInfo;
};

export const saveContactInfo = (info: ContactInfo) => {
  localStorage.setItem('rento_contact_info', JSON.stringify(info));
};

export default function ContactSettings() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const info = getContactInfo();
    setContactInfo(info);
  }, []);

  const handleSave = () => {
    setLoading(true);
    try {
      saveContactInfo(contactInfo);
      toast.success('Contact information updated successfully!');
    } catch (error) {
      toast.error('Failed to update contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-primary" />
          Contact Page Settings
        </CardTitle>
        <CardDescription>
          Update the contact information displayed on the Contact page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+254 712 345 678"
                value={contactInfo.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="support@rento.com"
                value={contactInfo.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Office Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Office Location
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="123 Rental Street"
                value={contactInfo.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City, Country</Label>
                <Input
                  id="city"
                  placeholder="Nairobi, Kenya"
                  value={contactInfo.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="00100"
                  value={contactInfo.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Business Hours
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mondayFriday">Monday - Friday</Label>
              <Input
                id="mondayFriday"
                placeholder="9:00 AM - 6:00 PM"
                value={contactInfo.mondayFriday}
                onChange={(e) => handleChange('mondayFriday', e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saturday">Saturday</Label>
                <Input
                  id="saturday"
                  placeholder="10:00 AM - 4:00 PM"
                  value={contactInfo.saturday}
                  onChange={(e) => handleChange('saturday', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sunday">Sunday</Label>
                <Input
                  id="sunday"
                  placeholder="Closed"
                  value={contactInfo.sunday}
                  onChange={(e) => handleChange('sunday', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Facebook className="w-4 h-4" />
            Social Media Links
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook URL
              </Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/rentohomes"
                value={contactInfo.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram URL
              </Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/rento_homes"
                value={contactInfo.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full btn-glow"
            size="lg"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Contact Information'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
