import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import EditProfileForm from "./EditProfileForm"
import EditPasswordForm from "./EditPasswordForm"
import ContactAddressSection from "./ContactAddressSection"

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Hồ sơ cá nhân</CardTitle>
                    <CardDescription>Cập nhật thông tin hiển thị của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    <EditProfileForm />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Đổi mật khẩu</CardTitle>
                    <CardDescription>Thay đổi mật khẩu đăng nhập ReBEV</CardDescription>
                </CardHeader>
                <CardContent>
                    <EditPasswordForm />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Địa chỉ giao hàng / liên hệ</CardTitle>
                    <CardDescription>Quản lý danh sách địa chỉ của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    <ContactAddressSection />
                </CardContent>
            </Card>
        </div>
    )
}
