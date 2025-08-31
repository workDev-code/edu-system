interface Props {
  label: string
  value?: string | number
}

export default function Block({ label, value }: Props) {
  return (
    <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105">
      {value !== undefined && value !== null ? (
        <>
          <div className="text-4xl font-extrabold text-purple-700 mb-2">{value}</div>
          <p className="text-sm font-medium text-purple-900">{label}</p>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm font-medium text-purple-900">{label}</p>
        </div>
      )}
    </div>
  )
}
