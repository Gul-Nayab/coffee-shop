'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '@/app/[username]/UserContext';
import axios from 'axios';
import Menu from '../../components/Menu';
import '../../../styles/SpecificStore.css';

import {
  IconMapPin,
  IconClock,
  IconPlug,
  IconArmchair,
  IconLeaf,
  IconWifi,
} from '@tabler/icons-react';


interface CoffeeShop {
  store_id: number;
  name: string;
  address: string;
  outlets: boolean | number | string;
  distance_from_sjsu: number | string;
  seating: boolean | number | string;
  open_time: string;
  close_time: string;
  vegan: boolean | number | string;
  wifi?: boolean | number | string;
}

const storeImages: Record<string, string> = {
  'phillz my mug make me fabulous': '/images/philz.jpeg',
  'very vegan villa': '/images/vegan.jpeg',
  'starbucks': '/images/starbucks.jpeg',
  'academic': '/images/academic.jpeg',
  'voyager': '/images/voyager.jpeg',
};


function normalizeStoreName(name?: string): string {
  return (
    name
      ?.toLowerCase()
      .replace(/\s+/g, ' ') // collapse multiple spaces
      .trim() ?? ''
  );
}



function ACoffeeShop() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { userType, loading } = useUser();
  const { store_id } = useParams();

  const [store, setStore] = useState<CoffeeShop>();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function getStore() {
      try {
        const response = await axios.get(
          `/api/coffee-shop/stores/${store_id}`,
          {
            timeout: 5000,
          }
        );
        setStore(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getStore();
  }, [store_id]);

  if (status === 'loading' || loading) {
    return <div className="specific-store-loading">Loading...</div>;
  }

  if (!session) return null;

  const asBool = (v: boolean | number | string | undefined) =>
    v === true || v === 1 || v === '1';

  return (
    <div className="specific-store-page">
      {(userType === 'customer' || userType === 'student') && store && (
        <>
          {/* INFO CARD */}
          <section className="specific-store-card">
            <div className="specific-store-card-header">
              <h1 className="specific-store-name">{store.name}</h1>
              <div className="specific-store-distance">
                <IconMapPin size={16} className="distance-icon" />
                {Number(store.distance_from_sjsu || 0).toFixed(2)} mi from SJSU
              </div>
            </div>

            {/* LOCATION + HOURS */}
            <div className="specific-store-info-row">
              {/* Location */}
              <div className="specific-store-info-block">
                <p className="specific-store-label">Location</p>
                <p className="specific-store-value">
                  <IconMapPin size={20} className="specific-store-icon" />
                  {store.address}
                </p>
              </div>

              {/* Hours */}
              <div className="specific-store-info-block">
                <p className="specific-store-label">Hours</p>
                <p className="specific-store-value">
                  <IconClock size={20} className="specific-store-icon" />
                  {store.open_time} AM to {store.close_time} PM
                </p>
              </div>
            </div>

            {/* AMENITIES */}
            <div className="specific-store-amenities">
              <p className="specific-store-amenities-title">
                Amenities available at this location:
              </p>

              <div className="specific-store-amenities-chips">
                {/* Outlets */}
                <span
                  className={
                    asBool(store.outlets)
                      ? 'amenity-chip amenity-chip-green'
                      : 'amenity-chip amenity-chip-red'
                  }
                >
                  <IconPlug size={18} className="amenity-chip-icon" />
                  Has outlets
                </span>

                {/* Seating */}
                <span
                  className={
                    asBool(store.seating)
                      ? 'amenity-chip amenity-chip-green'
                      : 'amenity-chip amenity-chip-red'
                  }
                >
                  <IconArmchair size={18} className="amenity-chip-icon" />
                  Indoor Seating
                </span>


                {/* Vegan */}
                <span
                  className={
                    asBool(store.vegan)
                      ? 'amenity-chip amenity-chip-green'
                      : 'amenity-chip amenity-chip-red'
                  }
                >
                  <IconLeaf size={18} className="amenity-chip-icon" />
                  Vegan options
                </span>

                {/* Wi-Fi */}
                <span
                  className={
                    asBool(store.wifi)
                      ? 'amenity-chip amenity-chip-green'
                      : 'amenity-chip amenity-chip-red'
                  }
                >
                  <IconWifi size={18} className="amenity-chip-icon" />
                  Free Wi-Fi
                </span>
              </div>
            </div>
          </section>

          {/* STORE IMAGE */}
          <div className="specific-store-photo-wrapper">
            <img
              src={
                storeImages[normalizeStoreName(store.name)] ||
                '/images/coffee-bg.jpg' // this file exists in public/images
              }
              alt={store.name}
              className="specific-store-photo"
            />
          </div>

          {/* MENU */}
          <section className="specific-store-menu-section">
            <h2 className="specific-store-menu-title">Menu</h2>
            <Menu store_id={String(store_id)} />
          </section>
        </>
      )}
    </div>
  );
}

export default ACoffeeShop;
