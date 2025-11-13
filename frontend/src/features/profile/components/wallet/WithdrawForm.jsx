import React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const WithdrawSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Vui lòng nhập số tiền.")
    .min(50000, "Số tiền tối thiểu là 50.000₫."),
  method: Yup.string().oneOf(["momo", "bank"]).required(),

  momoPhone: Yup.string().when("method", {
    is: "momo",
    then: (schema) =>
      schema.required("Vui lòng nhập số điện thoại MoMo."),
  }),

  momoName: Yup.string().when("method", {
    is: "momo",
    then: (schema) =>
      schema.required("Vui lòng nhập tên chủ tài khoản MoMo."),
  }),

  bankName: Yup.string().when("method", {
    is: "bank",
    then: (schema) =>
      schema.required("Vui lòng chọn ngân hàng."),
  }),

  bankNumber: Yup.string().when("method", {
    is: "bank",
    then: (schema) =>
      schema.required("Vui lòng nhập số tài khoản."),
  }),

  bankOwner: Yup.string().when("method", {
    is: "bank",
    then: (schema) =>
      schema.required("Vui lòng nhập tên chủ tài khoản."),
  }),
})

export default function WithdrawForm({ balance, onCancel, onConfirm }) {
  const formik = useFormik({
    initialValues: {
      amount: "",
      method: "momo",

      momoPhone: "",
      momoName: "",

      bankName: "",
      bankNumber: "",
      bankOwner: "",
    },

    validationSchema: WithdrawSchema,

    onSubmit: (values) => {
      onConfirm({
        amount: Number(values.amount),
        method: values.method,
        ...values,
      })
    },
  })

  const formatAmount = (v) =>
    v ? Number(v).toLocaleString("vi-VN") : ""

  const handleAmountChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "")
    if (!raw) return formik.setFieldValue("amount", "")
    let numeric = Number(raw)
    if (numeric > balance) numeric = balance
    formik.setFieldValue("amount", numeric)
  }

  return (
    <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
      <CardHeader className="px-6 py-5 border-b bg-gray-50 rounded-t-2xl">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Yêu cầu rút tiền
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 py-6 space-y-7">
        {/* AMOUNT */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">
            Số tiền muốn rút
          </label>

          <Input
            name="amount"
            placeholder="0"
            type="text"
            className={`h-12 text-lg font-semibold rounded-xl w-full ${
              formik.errors.amount && formik.touched.amount
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            value={formatAmount(formik.values.amount)}
            onChange={handleAmountChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.amount && formik.touched.amount && (
            <p className="text-xs text-red-500">{formik.errors.amount}</p>
          )}

          <p className="text-xs text-gray-500">
            Tối thiểu 50.000₫ — Tối đa {balance.toLocaleString("vi-VN")}₫
          </p>
        </div>

        {/* METHOD */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">
            Phương thức thanh toán
          </label>

          <Select
            value={formik.values.method}
            onValueChange={(val) => formik.setFieldValue("method", val)}
          >
            <SelectTrigger className="h-12 w-full rounded-xl border-gray-300 focus:border-blue-500">
              <SelectValue placeholder="Chọn phương thức" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="momo">Ví MoMo</SelectItem>
              <SelectItem value="bank">Ngân hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* SUB FORM */}
        {formik.values.method === "momo" ? (
          <div className="space-y-4">
            {/* momoPhone */}
            <div>
              <Input
                placeholder="Số điện thoại MoMo"
                name="momoPhone"
                className={`h-12 rounded-xl w-full ${
                  formik.errors.momoPhone && formik.touched.momoPhone
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.momoPhone && formik.touched.momoPhone && (
                <p className="text-xs text-red-500">{formik.errors.momoPhone}</p>
              )}
            </div>

            {/* momoName */}
            <div>
              <Input
                placeholder="Tên chủ tài khoản"
                name="momoName"
                className={`h-12 rounded-xl w-full ${
                  formik.errors.momoName && formik.touched.momoName
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.momoName && formik.touched.momoName && (
                <p className="text-xs text-red-500">{formik.errors.momoName}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* bankName */}
            <div>
              <Select
                onValueChange={(val) =>
                  formik.setFieldValue("bankName", val)
                }
              >
                <SelectTrigger
                  className={`h-12 w-full rounded-xl ${
                    formik.errors.bankName && formik.touched.bankName
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                >
                  <SelectValue placeholder="Chọn ngân hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MB Bank">MB Bank</SelectItem>
                  <SelectItem value="Vietcombank">Vietcombank</SelectItem>
                  <SelectItem value="Techcombank">Techcombank</SelectItem>
                  <SelectItem value="ACB">ACB</SelectItem>
                </SelectContent>
              </Select>

              {formik.errors.bankName && formik.touched.bankName && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.bankName}</p>
              )}
            </div>

            {/* bankNumber */}
            <div>
              <Input
                placeholder="Số tài khoản"
                name="bankNumber"
                className={`h-12 rounded-xl w-full ${
                  formik.errors.bankNumber && formik.touched.bankNumber
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.bankNumber && formik.touched.bankNumber && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.bankNumber}</p>
              )}
            </div>

            {/* bankOwner */}
            <div>
              <Input
                placeholder="Tên chủ tài khoản"
                name="bankOwner"
                className={`h-12 rounded-xl w-full ${
                  formik.errors.bankOwner && formik.touched.bankOwner
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.bankOwner && formik.touched.bankOwner && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.bankOwner}</p>
              )}
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 rounded-xl border-gray-300 hover:bg-gray-100"
            onClick={onCancel}
          >
            Hủy
          </Button>

          <Button
            type="button"
            className="flex-1 h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            onClick={formik.handleSubmit}
          >
            Xác nhận
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
