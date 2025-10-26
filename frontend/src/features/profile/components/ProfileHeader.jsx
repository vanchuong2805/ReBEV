import React from 'react'
import { Edit3, Shield, Star, Mail, Phone, MapPin, Calendar, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'


const ProfileHeader = ({ userData }) => {
    return (
        <Card className='mb-8'>
            <CardContent className='p-8'>
                <div className='flex flex-col lg:flex-row items-start lg:items-center gap-6'>
                    <div className='relative'>
                        <img
                            src={userData.avatar}
                            alt='Profile'
                            className='w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg'
                        />
                        <div className='absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center'>
                            <Shield className='w-3 h-3 text-white' />
                        </div>
                    </div>


                    <div className='flex-1'>
                        <div className='flex flex-col lg:flex-row lg:items-center gap-4 mb-4'>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900'>{userData.name}</h1>
                                <div className='flex items-center gap-2 mt-1'>
                                    <Badge variant='secondary' className='bg-yellow-100 text-yellow-800 border-yellow-200'>
                                        <Award className='w-3 h-3 mr-1' />
                                        {userData.memberLevel} Member
                                    </Badge>
                                </div>
                            </div>

                        </div>


                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <Mail className='w-4 h-4' />
                                {userData.email}
                            </div>
                            <div className='flex items-center gap-2'>
                                <Phone className='w-4 h-4' />
                                {userData.phone}
                            </div>
                            <div className='flex items-center gap-2'>
                                <Calendar className='w-4 h-4' />
                                Thành viên từ {userData.memberSince}
                            </div>
                        </div>
                    </div>


                    
                </div>
            </CardContent>
        </Card>
    )
}
export default ProfileHeader