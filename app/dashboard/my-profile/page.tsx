"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth.store";
import { getInitials } from "initials-extractor";
import Image from "next/image";
import toast from "react-hot-toast";

export default function MyProfilePage() {
  const { user } = useAuthStore();

  console.log(user);

  return (
    <div className="w-full px-2 mt-3">
      <div className="relative w-full">
        <Image
          src="/capa.svg"
          alt="Cover"
          width={977}
          height={220}
          className="w-full object-cover h-60 rounded-xl"
        />

        <div className="absolute -bottom-12 left-6 ">
          <div className="w-24 h-24 rounded-4xl p-1 border flex items-center justify-center bg-white">
            <span className="text-2xl font-bold text-gray-700">
              {getInitials(user?.username ?? "A")}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full border rounded-2xl border-[#DEDEE6] mt-20 p-6">
        <div className="w-full flex justify-between items-center mb-6">
          <h3 className="text-base font-bold">Informações do Perfil</h3>

          <Badge variant={"success"}>Ativo</Badge>
        </div>

        <div className="w-full flex justify-between mt-5">
          <div className="flex flex-col gap-2">
            <p className="text-md font-semibold">Nome</p>
            <p className="text-sm">{user?.username ?? "Não informado"}</p>
          </div>

          <div>
            <p className="text-md font-semibold">Email</p>
            <p className="text-sm ">{user?.email ?? "Não informado"}</p>
          </div>

          <div>
            <p className="text-md font-semibold">Número</p>
            <p className="text-sm ">{user?.phone ?? "Não informado"}</p>
          </div>
        </div>
        <div className="w-full flex justify-between mt-5">
          <div className="flex flex-col gap-2">
            <p className="text-md font-semibold">Cargo</p>
            <p className="text-sm border px-2 py-1 rounded-full w-max">
              {user?.roles?.[0] ?? "Não informado"}
            </p>
          </div>

          <div>
            <Button
              onClick={() => {
                toast.error("Funcionalidade ainda nao Implementada");
              }}
            >
              Editar Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
