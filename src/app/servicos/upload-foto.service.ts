import { Injectable } from '@angular/core';
import { Storage, StorageReference, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Observable, from, switchMap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UploadFotoService {

  constructor(private storage: Storage) { }

  uploadFoto(imagem: File, local: string): Observable<string>{
    const id_unico = uuidv4();
    const nome_arquivo = `${id_unico}_${imagem.name}`;
    const caminho_arquivo = `${local}${nome_arquivo}`;

    const referencia_armazenamento: StorageReference = ref(this.storage, caminho_arquivo);
    const tarefa_carregamento = uploadBytes(referencia_armazenamento, imagem);

    return from(tarefa_carregamento).pipe(
      switchMap((result) => getDownloadURL(result.ref))
    );
  }
}
