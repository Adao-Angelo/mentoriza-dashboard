_Mentoriza – Gestão de PAP_

O Mentoriza é uma plataforma digital desenvolvida para apoiar a gestão e acompanhamento da Prova de Aptidão Profissional (PAP) nas instituições de ensino.

A plataforma organiza a comunicação, acompanhamento e avaliação entre coordenadores, tutores, professores de PT e estudantes, garantindo transparência, organização e rastreabilidade das actividades.

O sistema utiliza RBAC (Role-Based Access Control) para garantir que cada utilizador tenha acesso apenas às funcionalidades adequadas ao seu papel dentro da plataforma.

Sistema de Permissões (RBAC)

O Mentoriza possui quatro tipos principais de utilizadores:

- Coordenador
- Tutor
- Professor de PT
- Estudante

Cada perfil possui permissões específicas dentro do sistema.

_Coordenador_

O Coordenador é o responsável pela gestão global da plataforma e pela organização do processo da PAP.

Funcionalidades

1- Acompanhar o progresso dos projects
2- Visualizar relatórios e estatísticas
3- Gerir prazos de entrega
4- Aprovar ou reprovar relatórios finais
5- Fazer upload e gestão de documentos institucionais

Permissões (RBAC)

Utilizadores -> Criar / Editar / Remover
Relatórios -> Visualizar / Aprovar
Documentos -> Criar / Editar / Remover
Avaliações -> Visualizar

_Tutor_

O Tutor acompanha os estudantes no desenvolvimento técnico do projeto.

Funcionalidades

1- Acompanhar grupos atribuídos
2- Orientar estudantes no desenvolvimento da PAP
3- Submeter feedback
4- Avaliar progresso do projeto
5- Consultar relatórios submetidos
6- Comunicar com estudantes

Permissões (RBAC)

- Grupos atribuídos -> Visualizar
- Estudantes do grupo -> Visualizar
- Relatórios -> Visualizar
- Feedback -> Criar / Editar
- Avaliações -> Submeter

_Professor de PT_

_Estudante_

O Estudante é o principal utilizador da plataforma e responsável pela submissão do projeto de PAP.

Funcionalidades

1- Submeter relatórios da PAP
2- Atualizar versões do relatório
3- Visualizar feedback de tutores e professores
4- Consultar prazos
5- Acompanhar o progresso do projeto

Permissões (RBAC)

- Relatórios -> Criar / Editar / Submeter
- Grupo -> Visualizar
- Avaliações -> Visualizar

_Estrutura de Controle de Acesso_

O sistema utiliza RBAC (Role-Based Access Control) para controlar o acesso às funcionalidades da plataforma.

Cada utilizador recebe um role no momento da criação da conta:

COORDINATOR
TUTOR
PT_TEACHER
STUDENT

As permissões são verificadas tanto no backend (API) quanto no frontend, garantindo maior segurança e integridade dos dados.
