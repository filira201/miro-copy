import { Button } from "@/shared/ui/kit/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/ui/kit/form";
import { Input } from "@/shared/ui/kit/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../model/use-login";
import { Spinner } from "@/shared/ui/kit/spinner";

const loginSchema = z.object({
  email: z.string({ error: "Email является обязательным" }).email("Неверный email"),
  password: z.string({ error: "Пароль является обязательным" }).min(6, "Пароль должен содержать не мнее 6 символов"),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { login, isPending, errorMessage } = useLogin();

  const onSubmit = form.handleSubmit((data) => {
    login(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Почта</FormLabel>
              <FormControl>
                <Input placeholder="admin@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}

        <Button disabled={isPending} type="submit">
          {isPending && <Spinner />}
          Войти
        </Button>
      </form>
    </Form>
  );
}
