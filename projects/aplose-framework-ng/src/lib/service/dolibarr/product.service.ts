import { Injectable } from '@angular/core';
import { Product } from '../../model/dolibarr/Product';
import { BehaviorSubject, lastValueFrom, Observable, of } from 'rxjs';
import { DolibarrDocument } from '../../model/dolibarr/DolibarrDocument';
import { DocumentFile } from '../../model/dolibarr/DocumentFile';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '../config.service';
import { Category } from '../../model/dolibarr/Category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public currentProduct!:Product;
  public productsDocumentsFiles$:BehaviorSubject<Map<DolibarrDocument,DocumentFile>>=new BehaviorSubject(new Map<DolibarrDocument,DocumentFile>());

  public products$:BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  private domParser:DOMParser = new DOMParser();

  constructor(private httpClient:HttpClient, private domSanitizer:DomSanitizer, private _configService: ConfigService) { 
  }

  async loadProductsOfCat(catId:number,firstLoad:boolean=false){
    if (firstLoad){
      // pour les autres il suffit de filtrer le tableau d'origine... avec un pipe !
      this.products$.next( await lastValueFrom( this.httpClient.get<Product[]>(this._configService.backendUrl + "/dolibarr/category/" + catId + "/objects?type=product")));
      //maintenant on va charger les images en base 64
      const products = this.products$.getValue();
      products.forEach(product=>{
        this.loadDocumentsOfProduct(product);
        this.loadCategoriesForProduct(product);
      })
    }
  }
  async loadCategoriesForProduct(product:Product){
    product.categories = await lastValueFrom(this.httpClient.get<Category[]>(this._configService.backendUrl+"/dolibarr/product/"+product.id+"/category"));
  }
  async loadDocumentsOfProduct(product:Product){
    let params = {modulepart:'product',id:product.id};
    let documents = await lastValueFrom(this.httpClient.get<DolibarrDocument[]>(this._configService.backendUrl+ "/dolibarr/getAll/documents",{params:params}));
    product.dolibarrDocuments = documents;
    //maintenant on charge la photo
    documents.forEach ( async (dolibarrDocument) =>  {
      if(!product.imageSrc && dolibarrDocument.type==='file'&&(dolibarrDocument.relativename?.endsWith('.png')||dolibarrDocument.relativename?.endsWith('.jpg')||dolibarrDocument.relativename?.endsWith('.jpeg'))){
        const imageFile = await lastValueFrom(this.getDocumentFile(dolibarrDocument));
        if (imageFile.content&&imageFile.content.length>0){
          product.imageAlt=imageFile.filename;
          let src = 'data:image/';
          if (imageFile.filename.endsWith('.png')){
            src += 'png';
          }else{
            src += 'jpeg';
          }
          src+= ';base64, ';
          src+= imageFile.content;
          product.imageSrc = src;
        }
      }else if(!product.x3dSafeInnerHtml && dolibarrDocument.type==='file'&&dolibarrDocument.relativename?.endsWith('.xhtml')){
        //alors on charge la 3D
        let documentFile:DocumentFile = await lastValueFrom(this.getDocumentFile(dolibarrDocument));
        if (documentFile.content&&documentFile.content.length>0){
          let decodedDocumentContent = this.decodeUTF8(atob(documentFile.content));
          let domDoc:Document = this.domParser.parseFromString(decodedDocumentContent,'application/xhtml+xml');
          let x3dElements = domDoc.getElementsByTagName('X3D');
          let x3dhtml = x3dElements[0];
          if (x3dhtml){
            product.x3dSafeInnerHtml = this.domSanitizer.bypassSecurityTrustHtml(x3dhtml.innerHTML);
          }
        }
      }
    });

  }
  getCurrentProduct():Product{
    return this.currentProduct;
  }
  setCurrentProduct(product:Product){
    this.currentProduct=product;
  }

  downloadFile(dolibarrDocument:DolibarrDocument){  
    this.getDocumentFile(dolibarrDocument).subscribe({
      next : response =>  {
        let documentFile:DocumentFile = response;
        if (documentFile.content&&documentFile.content.length>0){
          let blob:Blob;
          blob = this.base64toBlob(documentFile.content,documentFile['content-type']);
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = data;
          link.download = documentFile.filename||'';
          link.click();
        }
      },
      error: error => {},
      complete: ()=>{}
    });
  }

  public getDocumentFile(dolibarrDocument:DolibarrDocument):Observable<DocumentFile>{
    return this.httpClient.post<DocumentFile>(this._configService.backendUrl+'/dolibarr/document/download?modulePart=product',dolibarrDocument);
  }

  private decodeUTF8(binary:string) {
    const bytes = new Uint8Array(binary.length);
    for (let b = 0; b < bytes.length; ++b) {
        bytes[b] = binary.charCodeAt(b);
    }
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
}

  private base64toBlob(base64Data:string, contentType:string): Blob {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }


   loadProductImageById(productId: number): Observable<Product> {
    // Récupère le produit existant ou crée un produit temporaire avec l'ID
    const product: Product = { id: productId, ref: '', ref_ext: '', label: '', description: '' };
  
    // Charge les documents associés au produit
    this.loadDocumentsOfProduct(product);
    // console.log(product);
    
    // Retourne l'image si elle a été trouvée
    return of(product);
  }
  
}
