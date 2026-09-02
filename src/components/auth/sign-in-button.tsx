import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signIn, signOut } from '@/lib/auth';

export function SignInButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('github', { redirectTo: '/submit' });
      }}
    >
      <Button type="submit" className="gap-2">
        <LogIn className="size-4" aria-hidden />
        GitHub 로 로그인
      </Button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
        로그아웃
      </Button>
    </form>
  );
}
