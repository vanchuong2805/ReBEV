import React, { useState, useEffect } from 'react'
import {
  CheckCircle2,
  Star,
  Crown,
  Diamond,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getPackage } from '../service'

const iconById = {
  basic: Star,
  vip1: Crown,
  vip2: Diamond
}

const formatPrice = v => {
  if (v === 0) return 'Miễn phí'
  return v.toLocaleString('vi-VN') + 'đ'
}

const MembershipPackage = () => {
  const [selectedPlan, setSelectedPlan] = useState('vip1')
  const [packages, setPackages] = useState([])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getPackage()
        setPackages(data)
        console.log(' Gói đã tải:', data)
      } catch (error) {
        console.error(' Lỗi tải gói:', error)
      }
    }
    fetchPackages()
  }, [])

  const currentPlan = packages.find(p => p.id === selectedPlan)

  const handleChoose = () => {
    console.log('Chọn gói:', currentPlan)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50'>
      <div className='container mx-auto px-4 py-12 max-w-7xl'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            Chọn gói thành viên phù hợp
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Các gói thành viên dành cho người bán xe điện và pin – giúp tin đăng nổi bật và tiếp cận nhiều khách hàng hơn
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          {packages.map(pkg => {
            const Icon = iconById[pkg.id] ?? Star
            const isSelected = selectedPlan === pkg.id
            const isPopular = pkg.id === 'vip1'
            return (
              <Card
                key={pkg.id}
                className={`relative transition-all duration-300 cursor-pointer ${
                  isSelected ? 'ring-2 ring-red-500 shadow-xl scale-105' : 'hover:shadow-lg'
                } ${isPopular ? 'border-red-300' : ''}`}
                onClick={() => setSelectedPlan(pkg.id)}
              >
                {isPopular && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                    <Badge className='bg-red-600 text-white px-4 py-1 rounded-full flex items-center'>
                      <Sparkles className='w-3 h-3 mr-1' />
                      Phổ biến
                    </Badge>
                  </div>
                )}

                <CardHeader className='text-center pb-4'>
                  <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center'>
                    <Icon className='w-8 h-8 text-white' />
                  </div>
                  <CardTitle className='text-2xl font-bold'>{pkg.name}</CardTitle>

                  <div className='mt-4'>
                    <span className='text-3xl font-bold text-gray-900'>
                      {formatPrice(pkg.price)}
                    </span>
                    {pkg.duration && pkg.duration !== 0 && (
                      <span className='text-gray-600'> / {pkg.duration} ngày</span>
                    )}
                  </div>
                  <p className='text-gray-600 mt-3'>{pkg.description}</p>
                </CardHeader>

                <CardContent className='pt-2'>
                  <div className='flex flex-wrap gap-2 justify-center'>
                    <Badge variant={pkg.highlight ? 'default' : 'secondary'}>
                      Highlight {pkg.highlight && <CheckCircle2 className='w-4 h-4 ml-1' />}
                    </Badge>
                    <Badge variant={pkg.top ? 'default' : 'secondary'}>
                      Top trang chủ {pkg.top && <CheckCircle2 className='w-4 h-4 ml-1' />}
                    </Badge>
                  </div>

                  <Button
                    className={`w-full mt-6 ${
                      isSelected ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={handleChoose}
                  >
                    {isSelected ? 'Nâng cấp ngay' : 'Chọn gói này'}
                    <ArrowRight className='w-4 h-4 ml-2' />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MembershipPackage
