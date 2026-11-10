export type Sexo = 'M' | 'F';
export type StatusAnimal = 'ativo' | 'vendido' | 'abatido';
export type TipoManejo = 'vacina' | 'pesagem' | 'tratamento';

export interface Animal {
  id: string;
  brinco: string;
  nome?: string;
  especie: string;
  raca?: string;
  sexo: Sexo;
  nascimento: string;
  peso: number;
  pasto?: string;
  status: StatusAnimal;
}

export interface Manejo {
  id: string;
  tipo: TipoManejo;
  descricao: string;
  data: string;
  pesoKg?: number;
}
