# Code Style Guide - react-django-ecom-website

**Last Updated**: 2025-01-XX  
**Purpose**: Establish consistent coding standards for the entire codebase

---

## 📋 Table of Contents

1. [Variable Naming Convention](#variable-naming-convention)
2. [Code Comments Policy](#code-comments-policy)
3. [File Organization](#file-organization)
4. [Python Specific Rules](#python-specific-rules)
5. [JavaScript/JSX Specific Rules](#javascriptjsx-specific-rules)
6. [Git Repository Rules](#git-repository-rules)

---

## 🔤 Variable Naming Convention

### **Rule: Use camelCase Starting with Lowercase Letter**

All variables, function parameters, and local variables **MUST** use camelCase naming starting with a lowercase letter.

**Format**: `aNormalVariable`, `superFastString`, `orderDetails`

### Examples

#### ✅ **CORRECT:**
```python
# Python
def placeOrder(aRequest):
    aUser = aRequest.user
    requestData = aRequest.data
    orderItems = requestData['orderItems']
    
    for aOrderItem in orderItems:
        aProduct = Product.objects.get(id=aOrderItem['id'])
        anOrder = Order.objects.create(...)
```

```javascript
// JavaScript/JSX
const fetchTracking = async () => {
    const { data } = await httpService.get(`/api/order-tracking/`);
    const orderTracking = data.results.find(aTracking => aTracking.order === orderId);
    
    function getStatusColor(aStatus) {
        return colorMap[aStatus] || 'secondary';
    }
}
```

#### ❌ **INCORRECT:**
```python
# DON'T USE:
def placeOrder(request):  # ❌ Generic parameter name
    user = request.user  # ❌ Generic variable name
    data = request.data  # ❌ Generic variable name
    
    for x in orderItems:  # ❌ Single letter variable
        product = Product.objects.get(id=x['id'])  # ❌ Generic name
```

```javascript
// DON'T USE:
const fetchTracking = async () => {
    const { data } = await httpService.get(`/api/order-tracking/`);
    const tracking = data.results.find(t => t.order === orderId);  // ❌ Single letter
    
    function getStatusColor(status) {  // ❌ Generic parameter name
        return colorMap[status] || 'secondary';
    }
}
```

### Variable Naming Guidelines

1. **Start with lowercase letter**: `aRequest`, `anOrder`, `requestData`
2. **Use descriptive prefixes**:
   - `a` prefix for singular objects: `aUser`, `aProduct`, `anOrder`
   - `an` prefix when word starts with vowel: `anOrder`, `anError`, `anInstance`
   - Descriptive names for collections: `orderItems`, `productReviews`, `requestData`
3. **Avoid single-letter variables**: Use `aOrderItem` instead of `x`
4. **Avoid generic names**: Use `requestData` instead of `data`, `aUser` instead of `user`
5. **Use full words**: `aProduct` instead of `prod`, `anOrder` instead of `ord`

### Special Cases

#### React Hooks
React hooks like `useState`, `useEffect` variables can use standard naming:
```javascript
const [loading, setLoading] = useState(true);  // ✅ OK - React convention
const [orderDetails, setOrderDetails] = useState({});  // ✅ OK
```

#### Django Model Fields
Model fields can use camelCase (already implemented):
```python
class Order(models.Model):
    taxPrice = models.DecimalField(...)  # ✅ OK
    shippingPrice = models.DecimalField(...)  # ✅ OK
    isPaid = models.BooleanField(...)  # ✅ OK
```

#### Django ORM Queryset Variables
```python
queryset = Order.objects.all()  # ✅ OK - Django convention
serializer_class = OrderSerializer  # ✅ OK - Django convention
```

---

## 💬 Code Comments Policy

### **Rule: NO Comments in Code Files**

All code comments **MUST** be removed from code files and placed in `comments.txt` instead.

### What Gets Extracted

1. **Inline comments**: `# This is a comment`
2. **Block comments**: `/* This is a comment */`
3. **Docstrings**: `"""This is a docstring"""`
4. **Multi-line comments**: Comments spanning multiple lines

### Where Comments Go

All comments are moved to `comments.txt` with the following format:
```
### File: api/models.py
# Line 4: Create your models here.

### File: api/views.py
# Line 114: Create initial order tracking record
# Line 118: Can be set later by admin
```

### Exceptions

- **Configuration files**: Comments in settings files that explain configuration can stay
- **URL patterns**: Route documentation comments can stay if critical
- **Markdown files**: Documentation files are exempt (but they're in .gitignore anyway)

---

## 📁 File Organization

### Python Files Structure

```python
# Imports first
from django.db import models
from django.conf import settings

# Constants (if any)
STATUS_CHOICES = [...]

# Classes
class Order(models.Model):
    # Model fields
    
# Functions
def placeOrder(aRequest):
    # Function body
```

### JavaScript/JSX Files Structure

```javascript
// Imports first
import React, { useState, useEffect } from 'react';

// Constants
const statusStages = [...];

// Component/Function
function OrderTrackingTimeline({ orderId }) {
    // Component logic
}

// Export
export default OrderTrackingTimeline;
```

---

## 🐍 Python Specific Rules

### Function Parameters

All function parameters must use camelCase with descriptive names:

```python
✅ CORRECT:
def updateOrderToPaid(aRequest, aPk):
    anOrder = get_object_or_404(Order, id=aPk)
    paymentIntent = stripe.PaymentIntent.retrieve(...)

❌ INCORRECT:
def updateOrderToPaid(request, pk):  # Generic names
    order = get_object_or_404(Order, id=pk)
```

### Local Variables

```python
✅ CORRECT:
requestData = aRequest.data
aUser = aRequest.user
anOrder = Order.objects.create(...)
orderTracking = OrderTracking.objects.filter(...)

❌ INCORRECT:
data = request.data  # Too generic
user = request.user  # Too generic
order = Order.objects.create(...)  # Could be confused with model
```

### Loop Variables

```python
✅ CORRECT:
for aOrderItem in orderItems:
    aProduct = Product.objects.get(id=aOrderItem['id'])

❌ INCORRECT:
for x in orderItems:  # Single letter
    product = Product.objects.get(id=x['id'])  # Generic name
```

### Exception Handling

```python
✅ CORRECT:
except Exception as anError:
    print(anError)

❌ INCORRECT:
except Exception as e:  # Single letter
    print(e)
```

---

## ⚛️ JavaScript/JSX Specific Rules

### Function Parameters

```javascript
✅ CORRECT:
function getStatusColor(aStatus) {
    return colorMap[aStatus] || 'secondary';
}

const getCarrierLogo = (aCarrier) => {
    if (!aCarrier) return null;
}

❌ INCORRECT:
function getStatusColor(status) {  // Generic name
    return colorMap[status] || 'secondary';
}
```

### Arrow Function Parameters

```javascript
✅ CORRECT:
data.results.find(aTracking => aTracking.order === orderId)

❌ INCORRECT:
data.results.find(t => t.order === orderId)  // Single letter
```

### Async/Await Variables

```javascript
✅ CORRECT:
try {
    const { data } = await httpService.get(`/api/order-tracking/`);
    const orderTracking = data.results.find(aTracking => ...);
} catch (anError) {
    console.error('Error:', anError);
}

❌ INCORRECT:
try {
    const { data } = await httpService.get(...);
} catch (ex) {  // Abbreviated, generic
    console.error('Error:', ex);
}
```

### React Hooks Variables

React hook variables follow standard React conventions (exempt from strict camelCase prefix rule):

```javascript
✅ CORRECT (React Hooks):
const [loading, setLoading] = useState(true);
const [orderDetails, setOrderDetails] = useState({});
const [error, setError] = useState('');

❌ STILL NEED camelCase for custom variables:
const [imageErrors, setImageErrors] = useState({});  // ✅ OK - descriptive camelCase
```

---

## 🔒 Git Repository Rules

### Files Excluded from Git

All `.md` and `.txt` files are excluded from version control via `.gitignore`:

```gitignore
# Documentation and temporary files
*.md
*.txt
.gitignore
```

### Why?

1. **Documentation files** (`*.md`): Project documentation that changes frequently
2. **Comment files** (`*.txt`): Extracted comments that may be outdated
3. **Reduces clutter**: Keeps repository focused on code

### What IS Tracked

- All Python files (`.py`)
- All JavaScript/JSX files (`.js`, `.jsx`)
- Configuration files (`.json`, `.yaml`, `.env.example`)
- Templates and static files

---

## 📝 Code Review Checklist

Before committing code, verify:

- [ ] All variables use camelCase starting with lowercase
- [ ] No single-letter variables (except loop indices if necessary)
- [ ] No generic variable names (`data`, `user`, `product` → use `requestData`, `aUser`, `aProduct`)
- [ ] All comments removed from code files
- [ ] All comments added to `comments.txt` if needed
- [ ] Function parameters use descriptive camelCase names
- [ ] Exception variables use descriptive names (`anError` not `e`)

---

## 🔄 Migration Guide

If you're working on existing code:

### Step 1: Extract Comments
```bash
# Manually extract all comments to comments.txt
# Document file name and line numbers
```

### Step 2: Rename Variables
```python
# BEFORE:
def placeOrder(request):
    data = request.data
    user = request.user
    for x in items:
        product = Product.objects.get(id=x['id'])

# AFTER:
def placeOrder(aRequest):
    requestData = aRequest.data
    aUser = aRequest.user
    for aOrderItem in orderItems:
        aProduct = Product.objects.get(id=aOrderItem['id'])
```

### Step 3: Verify
- Run tests to ensure functionality unchanged
- Check for any missed comments
- Verify variable names follow convention

---

## 💡 Examples Reference

### Python Function Example

```python
✅ CORRECT:
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def placeOrder(aRequest):
    aUser = aRequest.user
    requestData = aRequest.data
    orderItems = requestData['orderItems']
    
    if not orderItems or len(orderItems) == 0:
        return Response({'detail': 'No Order items'}, status=status.HTTP_400_BAD_REQUEST)
    
    with transaction.atomic():
        anOrder = Order.objects.create(
            user=aUser,
            paymentMethod=requestData['paymentMethod'],
            taxPrice=requestData['taxPrice'],
            shippingPrice=requestData['shippingPrice'],
            totalPrice=requestData['totalPrice']
        )
        
        for aOrderItem in orderItems:
            aProduct = Product.objects.get(id=aOrderItem['id'])
            anOrderItem = OrderItem.objects.create(
                product=aProduct,
                order=anOrder,
                productName=aProduct.name,
                qty=aOrderItem['qty'],
                price=aProduct.price,
                image=aProduct.image.name
            )
            
            aProduct.countInStock -= aOrderItem['qty']
            aProduct.save()
```

### JavaScript Function Example

```javascript
✅ CORRECT:
function OrderTrackingTimeline({ orderId }) {
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const getStatusColor = (aStatus) => {
        const colorMap = {
            'pending': 'secondary',
            'processing': 'info',
            'delivered': 'success',
        };
        return colorMap[aStatus] || 'secondary';
    };
    
    const getCarrierLogo = (aCarrier) => {
        if (!aCarrier) return null;
        const carrierName = aCarrier.toLowerCase();
        return carrierName;
    };
    
    useEffect(() => {
        const fetchTracking = async () => {
            try {
                const { data } = await httpService.get(`/api/order-tracking/`);
                const orderTracking = data.results.find(aTracking => 
                    aTracking.order === orderId
                );
                if (orderTracking) {
                    setTracking(orderTracking);
                }
            } catch (anError) {
                console.error('Error:', anError);
                setError('Unable to load tracking information.');
            }
            setLoading(false);
        };
        fetchTracking();
    }, [orderId]);
}
```

---

## ⚠️ Common Mistakes to Avoid

1. **Using single letters**: `x`, `i`, `e`, `t` → Use descriptive names
2. **Generic names**: `data`, `user`, `item` → Use `requestData`, `aUser`, `aOrderItem`
3. **Forgetting prefixes**: `order` → Should be `anOrder` for clarity
4. **Leaving comments**: Always remove and add to `comments.txt`
5. **Inconsistent naming**: Mixing `aOrder` and `order` in same file

---

## 📚 Additional Resources

- **Python PEP 8**: https://www.python.org/dev/peps/pep-0008/ (Note: We override variable naming)
- **JavaScript Style Guide**: https://github.com/airbnb/javascript
- **React Best Practices**: https://react.dev/learn

---

## 🎯 Quick Reference

| Rule | Format | Example |
|------|--------|---------|
| Variable | camelCase, lowercase start | `aRequest`, `anOrder`, `requestData` |
| Function Parameter | camelCase, descriptive | `aRequest`, `aPk`, `aStatus` |
| Loop Variable | camelCase, descriptive | `aOrderItem`, `aProduct` |
| Exception | camelCase, descriptive | `anError`, `anException` |
| Comments | None in code | All in `comments.txt` |
| React Hooks | Standard React | `loading`, `setLoading` |

---

**Remember**: Consistency is key! Follow these rules throughout the entire codebase.

**Questions?** Refer to this guide or check existing code for examples.

