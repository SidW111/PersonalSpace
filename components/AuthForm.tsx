
type FormType = "sign-in" | "sign-up"
export default function AuthForm({type}:{type:FormType}) {
return <div>
    {type}
</div>
}