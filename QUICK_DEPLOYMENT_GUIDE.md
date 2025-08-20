# 🚀 Quick Deployment Guide for PeakCrews

## 📋 **Overview**

This guide provides step-by-step instructions to deploy PeakCrews to production. The platform is feature-complete and ready for deployment.

## ⚡ **Quick Start (5 minutes)**

### **1. Prerequisites**
- Node.js 18+ installed
- Domain name and hosting provider
- Cursor API credentials
- Stripe account (for payments)

### **2. Environment Setup**
```bash
# Copy production environment template
cp env.production.example .env.production

# Edit with your actual values
nano .env.production
```

### **3. Deploy**
```bash
# Run the deployment script
./scripts/deploy.sh
```

### **4. Create Admin Account**
- Visit: `https://yourdomain.com/admin-setup`
- Use the setup key from your environment variables
- Create a strong admin password

## 🔧 **Detailed Deployment Steps**

### **Step 1: Environment Configuration**

#### **Required Environment Variables**
```bash
# Cursor API (Required)
CURSOR_API_KEY=your_production_cursor_api_key
CURSOR_PROJECT_ID=your_cursor_project_id

# App Configuration (Required)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Admin Setup (Required)
ADMIN_SETUP_KEY=your_secure_setup_key

# Stripe (Required for payments)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### **Generate Security Keys**
```bash
# Generate admin setup key
openssl rand -base64 32

# Generate NextAuth secret
openssl rand -base64 32
```

### **Step 2: Build and Deploy**

#### **Option A: Automated Deployment**
```bash
# Run the deployment script
./scripts/deploy.sh
```

#### **Option B: Manual Deployment**
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### **Step 3: Domain and SSL Setup**

#### **Domain Configuration**
1. **Point your domain** to your hosting provider
2. **Configure DNS records** (A record or CNAME)
3. **Set up SSL certificate** (Let's Encrypt or provider SSL)

#### **SSL Configuration**
```bash
# If using Let's Encrypt
sudo certbot --nginx -d yourdomain.com

# Or configure with your hosting provider
```

### **Step 4: Admin Account Creation**

#### **Create Admin Account**
1. **Visit**: `https://yourdomain.com/admin-setup`
2. **Enter details**:
   - Name: Your full name
   - Email: admin@yourdomain.com
   - Password: Strong password (12+ chars)
   - Setup Key: Your generated key

#### **Verify Admin Access**
1. **Visit**: `https://yourdomain.com/admin`
2. **Sign in** with your admin credentials
3. **Verify** all admin features work

### **Step 5: Testing and Verification**

#### **Core Features Test**
- [ ] **User Registration**: `/register`
- [ ] **Job Posting**: `/post-job`
- [ ] **Job Applications**: `/jobs`
- [ ] **Messaging**: `/messages`
- [ ] **Payments**: `/payments`
- [ ] **Reviews**: `/reviews`
- [ ] **Search**: `/search`
- [ ] **Admin Panel**: `/admin`

#### **Mobile Testing**
- [ ] **Mobile Responsiveness**: Test on mobile devices
- [ ] **PWA Installation**: Test "Add to Home Screen"
- [ ] **Touch Interactions**: Verify touch-friendly design

## 🔒 **Security Configuration**

### **Essential Security Steps**
1. **Enable HTTPS** for all traffic
2. **Set up firewall** rules
3. **Configure rate limiting**
4. **Enable MFA** for admin accounts
5. **Set up monitoring** and alerts

### **Security Checklist**
- [ ] **SSL Certificate** installed and working
- [ ] **Admin password** changed from default
- [ ] **Two-factor authentication** enabled
- [ ] **Rate limiting** configured
- [ ] **Input validation** working
- [ ] **CORS** properly configured

## 📊 **Monitoring Setup**

### **Essential Monitoring**
1. **Uptime Monitoring**: Pingdom, UptimeRobot
2. **Error Tracking**: Sentry, LogRocket
3. **Performance Monitoring**: New Relic, DataDog
4. **Analytics**: Google Analytics

### **Health Checks**
```bash
# Test application health
curl -f https://yourdomain.com

# Test API endpoints
curl -f https://yourdomain.com/api/jobs
curl -f https://yourdomain.com/api/health
```

## 🎯 **Post-Deployment Tasks**

### **Immediate Tasks (Day 1)**
1. **Create admin account** and verify access
2. **Test all core features** thoroughly
3. **Set up monitoring** and alerts
4. **Configure backup** procedures
5. **Test payment processing** with live Stripe

### **Week 1 Tasks**
1. **User onboarding** and support setup
2. **Performance optimization** based on usage
3. **Security audit** and vulnerability scan
4. **Documentation updates** and training
5. **Analytics setup** and tracking

### **Ongoing Tasks**
1. **Regular security updates**
2. **Performance monitoring**
3. **User feedback collection**
4. **Feature updates** and improvements
5. **Backup verification** and testing

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### **Environment Variables**
```bash
# Check environment variables
echo $CURSOR_API_KEY
echo $NEXT_PUBLIC_APP_URL

# Verify .env.production file
cat .env.production
```

#### **Port Conflicts**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

#### **SSL Issues**
```bash
# Test SSL configuration
curl -I https://yourdomain.com

# Check SSL certificate
openssl s_client -connect yourdomain.com:443
```

### **Support Resources**
- **Documentation**: Check the [Migration Guide](MIGRATION_GUIDE.md)
- **Admin Guide**: [Admin Credentials Guide](ADMIN_CREDENTIALS_GUIDE.md)
- **Payment Setup**: [Payment Processing Summary](PAYMENT_PROCESSING_SUMMARY.md)
- **Mobile Features**: [Mobile App Development Summary](Mobile%20App%20Development%20&%20Responsive%20Design%20-%20Implementation%20Summary.md)

## 📞 **Getting Help**

### **Before Asking for Help**
1. **Check the logs** for error messages
2. **Verify environment variables** are set correctly
3. **Test the feature** in development first
4. **Check the documentation** for known issues

### **When You Need Help**
1. **Describe the issue** clearly
2. **Include error messages** and logs
3. **Mention your environment** (OS, Node version, etc.)
4. **Provide steps to reproduce** the issue

## 🎉 **Success Metrics**

### **Technical Metrics**
- **Uptime**: 99.9% or higher
- **Page Load Time**: < 3 seconds
- **API Response Time**: < 500ms
- **Error Rate**: < 0.1%

### **Business Metrics**
- **User Registration**: Smooth onboarding
- **Job Posting**: Successful job creation
- **Payment Processing**: Successful transactions
- **User Engagement**: Active messaging and applications

## 🔗 **Useful URLs**

### **Production URLs**
- **Main App**: `https://yourdomain.com`
- **Admin Setup**: `https://yourdomain.com/admin-setup`
- **Admin Panel**: `https://yourdomain.com/admin`
- **Job Feed**: `https://yourdomain.com/jobs`
- **Mobile Jobs**: `https://yourdomain.com/mobile-jobs`

### **Testing URLs**
- **Test Payments**: `https://yourdomain.com/test-payments`
- **Test Search**: `https://yourdomain.com/test-search`
- **Test Reviews**: `https://yourdomain.com/test-reviews`
- **Test Admin**: `https://yourdomain.com/test-admin`

## 🚀 **Ready to Deploy!**

Your PeakCrews platform is feature-complete and ready for production deployment. Follow this guide to get your platform live and serving users in the trades industry!

**Estimated Deployment Time**: 30-60 minutes for initial setup

**Next Steps**: Deploy, test, and start onboarding your first users!
