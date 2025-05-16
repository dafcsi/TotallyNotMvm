import { Injectable } from '@angular/core';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { Felhasznalo } from '../models/felhasznalo.model';
import { VillanyoraAllas } from '../models/villanyora-allas.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private readonly USERS_COLLECTION = 'felhasznalok';
  private readonly METER_READINGS_COLLECTION = 'villanyora-allasok';
  private db = getFirestore();

  constructor() { }

  // ========== USER CRUD OPERATIONS ==========

  // Create a new user
  addUser(user: Felhasznalo): Observable<string> {
    const collectionRef = collection(this.db, this.USERS_COLLECTION);
    return from(addDoc(collectionRef, user)).pipe(
      map(docRef => docRef.id)
    );
  }

  // Get a specific user
  getUserById(id: string): Observable<Felhasznalo | null> {
    const docRef = doc(this.db, this.USERS_COLLECTION, id);
    return from(getDoc(docRef)).pipe(
      map(docSnap => docSnap.exists() ? { id: docSnap.id, ...docSnap.data() as Omit<Felhasznalo, 'id'> } : null)
    );
  }

  // Update user information without affecting meter readings
  updateUser(id: string, data: Partial<Felhasznalo>): Observable<void> {
    const docRef = doc(this.db, this.USERS_COLLECTION, id);
    // Remove allasok from the update data since they're stored separately
    const { allasok, ...updateData } = data;
    return from(updateDoc(docRef, updateData as any));
  }

  // Delete a user
  deleteUser(id: string): Observable<void> {
    const docRef = doc(this.db, this.USERS_COLLECTION, id);
    return from(deleteDoc(docRef));
  }

  // Get all users
  getAllUsers(): Observable<Felhasznalo[]> {
    const collectionRef = collection(this.db, this.USERS_COLLECTION);
    return from(getDocs(collectionRef)).pipe(
      map(snapshot => 
        snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data() as Omit<Felhasznalo, 'id'>
        }))
      )
    );
  }

  // ========== COMPLEX FIRESTORE QUERIES ==========

  // 1. Get active users only
  getActiveUsers(): Observable<Felhasznalo[]> {
    const collectionRef = collection(this.db, this.USERS_COLLECTION);
    const q = query(collectionRef, where('aktiv', '==', true));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data() as Omit<Felhasznalo, 'id'>
        }))
      )
    );
  }

  // 2. Get admin users only
  getAdminUsers(): Observable<Felhasznalo[]> {
    const collectionRef = collection(this.db, this.USERS_COLLECTION);
    const q = query(collectionRef, where('szerepkor', '==', 'admin'));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data() as Omit<Felhasznalo, 'id'>
        }))
      )
    );
  }

  // 3. Get users sorted by name with pagination
  getUsersSortedByName(lastUserName?: string, pageSize: number = 10): Observable<Felhasznalo[]> {
    const collectionRef = collection(this.db, this.USERS_COLLECTION);
    let q;
    
    if (lastUserName) {
      const lastUserDoc = doc(this.db, this.USERS_COLLECTION, lastUserName);
      q = query(
        collectionRef, 
        orderBy('nev'), 
        startAfter(lastUserDoc), 
        limit(pageSize)
      );
    } else {
      q = query(
        collectionRef, 
        orderBy('nev'), 
        limit(pageSize)
      );
    }
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data() as Omit<Felhasznalo, 'id'>
        }))
      )
    );
  }

  // 4. Get meter readings with high values
  getHighMeterReadings(threshold: number = 5000): Observable<(VillanyoraAllas & { id: string })[]> {
    const collectionRef = collection(this.db, this.METER_READINGS_COLLECTION);
    const q = query(
      collectionRef, 
      where('ertek', '>', threshold),
      orderBy('ertek', 'desc')
    );
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          // Convert any potential Firestore Timestamps to Date objects
          if (data['datum'] && typeof data['datum'].toDate === 'function') {
            data['datum'] = data['datum'].toDate();
          }
          if (data['createdAt'] && typeof data['createdAt'].toDate === 'function') {
            data['createdAt'] = data['createdAt'].toDate();
          }
          return {
            id: docSnap.id,
            ...data as VillanyoraAllas
          };
        })
      )
    );
  }

  // ========== METER READING CRUD OPERATIONS ==========

  // Add new meter reading
  addMeterReading(userId: string, reading: VillanyoraAllas): Observable<string> {
    const readingWithUserId = {
      ...reading,
      userId,
      createdAt: new Date()
    };
    
    const collectionRef = collection(this.db, this.METER_READINGS_COLLECTION);
    return from(addDoc(collectionRef, readingWithUserId)).pipe(
      map(docRef => docRef.id)
    );
  }

  // Get all meter readings for a user
  getUserMeterReadings(userId: string): Observable<(VillanyoraAllas & { id: string })[]> {
    const collectionRef = collection(this.db, this.METER_READINGS_COLLECTION);
    const q = query(collectionRef, where('userId', '==', userId));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data() as VillanyoraAllas
        }))
      )
    );
  }

  // Update meter reading
  updateMeterReading(readingId: string, data: Partial<VillanyoraAllas>): Observable<void> {
    const docRef = doc(this.db, this.METER_READINGS_COLLECTION, readingId);
    return from(updateDoc(docRef, data as any));
  }

  // Delete meter reading
  deleteMeterReading(readingId: string): Observable<void> {
    const docRef = doc(this.db, this.METER_READINGS_COLLECTION, readingId);
    return from(deleteDoc(docRef));
  }
}