import React from 'react'
import { BarChart3, Car, FileText, Heart,ShoppingCart, Package, Edit3, LogOut, Wallet} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'



const SidebarNav = ({ activeTab, setActiveTab }) => {
    const Item = ({ value, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(value)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${activeTab === value ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-700'
                }`}
        >
            <Icon className='w-5 h-5' />
            {label}
        </button>
    )


    return (
        <Card className='sticky top-4'>
            <CardHeader>
                <CardTitle className='text-lg'>Menu điều hướng</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
                <nav className='space-y-1'>
                    <Item value='listings' icon={Car} label='Tin đăng' />
                    <Item value='purchases' icon={ShoppingCart} label='Đơn mua' />
                    <Item value='sales' icon={Package} label='Đơn bán' />
                    <Item value='transactions' icon={FileText} label='Giao dịch' />
                    <Item value='favorites' icon={Heart} label='Quan tâm' />
                    <Item value='settings' icon={Edit3} label='Chỉnh sửa' />
                    <Item value='wallet' icon={Wallet} label='Ví ReBEV' />
                    <Item value='dashboard' icon={BarChart3} label='Thống kê' />
                    <Item value='logout' icon={LogOut} label='Đăng xuất' />
                </nav>
            </CardContent>
        </Card>
    )
}


export default SidebarNav